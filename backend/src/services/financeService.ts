import { Collection, Db } from 'mongodb';
import { getDb } from '../config/db';
import { Budget } from '../models/Budget';

export class FinanceService {
  private db: Db;
  private budgets: Collection<Budget>;

  constructor() {
    this.db = getDb();
    this.budgets = this.db.collection<Budget>('budgets');
  }

  // Budgets CRUD
  async getBudgets(period: string): Promise<Budget[]> {
    return this.budgets.find({ period }).toArray();
  }

  async createBudget(input: Omit<Budget, '_id' | 'created_at' | 'updated_at'>): Promise<Budget> {
    const doc: any = { ...input, created_at: new Date() };
    const res = await this.budgets.insertOne(doc);
    return { _id: res.insertedId, ...doc };
  }

  async updateBudget(id: string, update: Partial<Omit<Budget, '_id' | 'created_at'>>): Promise<Budget | null> {
    const { ObjectId } = await import('mongodb');
    const _id = new ObjectId(id);
    const res = await this.budgets.findOneAndUpdate({ _id }, { $set: { ...update, updated_at: new Date() } }, { returnDocument: 'after' });
    return res;
  }

  // Overview and aggregations
  async getOverview(period: string): Promise<any> {
    // Sum budgets for period
    const budgets = await this.getBudgets(period);
    const total_budget = budgets.reduce((sum, b) => sum + (b.allocated || 0), 0);

    // Sum payments (approved or paid) for period
    // Assuming created_at within period; for real month parsing we would compute date range
    const payments = await this.db.collection('payments')
      .aggregate([
        {
          $match: {
            status: { $in: ['approved', 'paid'] },
            // naive period match: store period in YYYY-MM and compare via $expr or store month on payment doc
          }
        },
        {
          $group: { _id: null, amount_spent: { $sum: '$amount' } }
        }
      ]).toArray();

    const amount_spent = payments.length ? payments[0].amount_spent : 0;
    const percent_used = total_budget > 0 ? Math.round((amount_spent / total_budget) * 100) : 0;

    const pending_payments_count = await this.db.collection('payments').countDocuments({ status: 'pending' });

    const overbudget_items = await this.getOverbudget(period);

    return {
      total_budget,
      amount_spent,
      percent_used,
      pending_payments: pending_payments_count,
      overbudget_count: overbudget_items.length,
    };
  }

  async getOverbudget(period: string): Promise<Array<{ category: string; allocated: number; spent: number; percent: number }>> {
    const budgets = await this.getBudgets(period);
    if (!budgets.length) return [];

    // Sum payments by category
    const byCategory = await this.db.collection('payments')
      .aggregate([
        { $match: { status: { $in: ['approved', 'paid'] } } },
        { $group: { _id: '$category', spent: { $sum: '$amount' } } }
      ]).toArray();

    const map: Record<string, number> = {};
    byCategory.forEach((r: any) => { if (r._id) map[r._id] = r.spent; });

    const result = budgets.map((b) => {
      const spent = map[b.category] || 0;
      const percent = b.allocated > 0 ? Math.round((spent / b.allocated) * 100) : 0;
      return { category: b.category, allocated: b.allocated, spent, percent };
    }).filter(item => item.spent > item.allocated);

    return result;
  }

  async getRecentTransactions(limit = 10): Promise<any[]> {
    return this.db.collection('payments')
      .find()
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();
  }

  async createManagerApprovalRequest(input: { payment_ids: string[]; note?: string; requested_by?: string | null }): Promise<any> {
    if (!Array.isArray(input.payment_ids) || input.payment_ids.length === 0) {
      throw new Error('payment_ids is required');
    }
    const { ObjectId } = await import('mongodb');
    const ids = input.payment_ids.map((id) => new ObjectId(id));

    // Aggregate summary for the request
    const payments = await this.db.collection('payments').find({ _id: { $in: ids } }).toArray();
    const total_amount = payments.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

    const requestDoc = {
      type: 'manager_approval_request',
      payment_ids: ids,
      total_amount,
      note: input.note || '',
      requested_by: input.requested_by || null,
      created_at: new Date(),
      status: 'pending',
      audience: 'manager'
    };

    // Store as a notification for managers
    const res = await this.db.collection('notifications').insertOne({
      ...requestDoc,
      read: false,
    });

    return { _id: res.insertedId, ...requestDoc };
  }

  async listManagerApprovalRequests(status: string = 'pending'): Promise<any[]> {
    const filter: any = { type: 'manager_approval_request' };
    if (status) filter.status = status;
    return this.db.collection('notifications')
      .find(filter)
      .sort({ created_at: -1 })
      .toArray();
  }

  async decideManagerApprovalRequest(id: string, decision: 'approved' | 'denied', managerId?: string | null): Promise<any | null> {
    const { ObjectId } = await import('mongodb');
    const _id = new ObjectId(id);
    const notif = await this.db.collection('notifications').findOne({ _id, type: 'manager_approval_request' });
    if (!notif) return null;

    // Update notification
    const updated = await this.db.collection('notifications').findOneAndUpdate(
      { _id },
      { $set: { status: decision, decided_by: managerId || null, decided_at: new Date(), read: true } },
      { returnDocument: 'after' }
    );

    // If approved, ensure related payments are at least 'approved'
    if (decision === 'approved' && notif.payment_ids && Array.isArray(notif.payment_ids) && notif.payment_ids.length) {
      await this.db.collection('payments').updateMany(
        { _id: { $in: notif.payment_ids } },
        { $set: { status: 'approved' } }
      );
    }

    return updated;
  }
}
