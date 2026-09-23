"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const db_1 = require("../config/db");
class FinanceService {
    constructor() {
        this.db = (0, db_1.getDb)();
        this.budgets = this.db.collection('budgets');
    }
    async getBudgets(period) {
        return this.budgets.find({ period }).toArray();
    }
    async createBudget(input) {
        const doc = { ...input, created_at: new Date() };
        const res = await this.budgets.insertOne(doc);
        return { _id: res.insertedId, ...doc };
    }
    async updateBudget(id, update) {
        const { ObjectId } = await Promise.resolve().then(() => __importStar(require('mongodb')));
        const _id = new ObjectId(id);
        const res = await this.budgets.findOneAndUpdate({ _id }, { $set: { ...update, updated_at: new Date() } }, { returnDocument: 'after' });
        return res;
    }
    async getOverview(period) {
        const budgets = await this.getBudgets(period);
        const total_budget = budgets.reduce((sum, b) => sum + (b.allocated || 0), 0);
        const payments = await this.db.collection('payments')
            .aggregate([
            {
                $match: {
                    status: { $in: ['approved', 'paid'] },
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
    async getOverbudget(period) {
        const budgets = await this.getBudgets(period);
        if (!budgets.length)
            return [];
        const byCategory = await this.db.collection('payments')
            .aggregate([
            { $match: { status: { $in: ['approved', 'paid'] } } },
            { $group: { _id: '$category', spent: { $sum: '$amount' } } }
        ]).toArray();
        const map = {};
        byCategory.forEach((r) => { if (r._id)
            map[r._id] = r.spent; });
        const result = budgets.map((b) => {
            const spent = map[b.category] || 0;
            const percent = b.allocated > 0 ? Math.round((spent / b.allocated) * 100) : 0;
            return { category: b.category, allocated: b.allocated, spent, percent };
        }).filter(item => item.spent > item.allocated);
        return result;
    }
    async getRecentTransactions(limit = 10) {
        return this.db.collection('payments')
            .find()
            .sort({ created_at: -1 })
            .limit(limit)
            .toArray();
    }
    async createManagerApprovalRequest(input) {
        if (!Array.isArray(input.payment_ids) || input.payment_ids.length === 0) {
            throw new Error('payment_ids is required');
        }
        const { ObjectId } = await Promise.resolve().then(() => __importStar(require('mongodb')));
        const ids = input.payment_ids.map((id) => new ObjectId(id));
        const payments = await this.db.collection('payments').find({ _id: { $in: ids } }).toArray();
        const total_amount = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
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
        const res = await this.db.collection('notifications').insertOne({
            ...requestDoc,
            read: false,
        });
        return { _id: res.insertedId, ...requestDoc };
    }
    async listManagerApprovalRequests(status = 'pending') {
        const filter = { type: 'manager_approval_request' };
        if (status)
            filter.status = status;
        return this.db.collection('notifications')
            .find(filter)
            .sort({ created_at: -1 })
            .toArray();
    }
    async decideManagerApprovalRequest(id, decision, managerId) {
        const { ObjectId } = await Promise.resolve().then(() => __importStar(require('mongodb')));
        const _id = new ObjectId(id);
        const notif = await this.db.collection('notifications').findOne({ _id, type: 'manager_approval_request' });
        if (!notif)
            return null;
        const updated = await this.db.collection('notifications').findOneAndUpdate({ _id }, { $set: { status: decision, decided_by: managerId || null, decided_at: new Date(), read: true } }, { returnDocument: 'after' });
        if (decision === 'approved' && notif.payment_ids && Array.isArray(notif.payment_ids) && notif.payment_ids.length) {
            await this.db.collection('payments').updateMany({ _id: { $in: notif.payment_ids } }, { $set: { status: 'approved' } });
        }
        return updated;
    }
}
exports.FinanceService = FinanceService;
//# sourceMappingURL=financeService.js.map