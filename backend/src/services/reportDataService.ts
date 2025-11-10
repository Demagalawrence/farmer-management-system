import { getDb } from '../config/db';
import { ObjectId } from 'mongodb';

export interface ReportPeriod {
  start_date: Date;
  end_date: Date;
}

export interface RevenueData {
  total_revenue: number;
  total_payments: number;
  average_payment: number;
  trend_data: { period: string; amount: number; count: number }[];
}

export interface PaymentStatusData {
  pending: { count: number; amount: number };
  approved: { count: number; amount: number };
  paid: { count: number; amount: number };
  rejected: { count: number; amount: number };
  total: { count: number; amount: number };
}

export interface BudgetData {
  categories: {
    name: string;
    allocated: number;
    spent: number;
    remaining: number;
    utilization_percentage: number;
  }[];
  total_allocated: number;
  total_spent: number;
  total_remaining: number;
}

export interface FinancialReportData {
  period: ReportPeriod;
  revenue: RevenueData;
  payment_status: PaymentStatusData;
  budget: BudgetData;
  summary: {
    total_farmers: number;
    total_transactions: number;
    net_profit: number;
    profit_margin: number;
  };
}

export class ReportDataService {
  private get db() {
    return getDb();
  }

  async getRevenueAndProfitData(startDate: Date, endDate: Date): Promise<RevenueData> {
    const paymentsCollection = this.db.collection('payments');

    // Get all paid payments in the period
    const paidPayments = await paymentsCollection
      .find({
        status: 'paid',
        payment_date: { $gte: startDate, $lte: endDate }
      })
      .toArray();

    const total_revenue = paidPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const total_payments = paidPayments.length;
    const average_payment = total_payments > 0 ? total_revenue / total_payments : 0;

    // Aggregate by month for trend data
    const trendData = await paymentsCollection.aggregate([
      {
        $match: {
          status: 'paid',
          payment_date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $project: {
          year: { $year: '$payment_date' },
          month: { $month: '$payment_date' },
          amount: '$amount'
        }
      },
      {
        $group: {
          _id: { year: '$year', month: '$month' },
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]).toArray();

    const trend_data = trendData.map((item: any) => ({
      period: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      amount: item.amount,
      count: item.count
    }));

    return {
      total_revenue,
      total_payments,
      average_payment,
      trend_data
    };
  }

  async getPaymentStatusData(startDate: Date, endDate: Date): Promise<PaymentStatusData> {
    const paymentsCollection = this.db.collection('payments');

    const statusAggregation = await paymentsCollection.aggregate([
      {
        $match: {
          created_at: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      }
    ]).toArray();

    const statusMap: any = {
      pending: { count: 0, amount: 0 },
      approved: { count: 0, amount: 0 },
      paid: { count: 0, amount: 0 },
      rejected: { count: 0, amount: 0 }
    };

    statusAggregation.forEach((item: any) => {
      if (statusMap[item._id]) {
        statusMap[item._id] = {
          count: item.count,
          amount: item.amount
        };
      }
    });

    const total_count = Object.values(statusMap).reduce((sum: number, s: any) => sum + s.count, 0);
    const total_amount = Object.values(statusMap).reduce((sum: number, s: any) => sum + s.amount, 0);

    return {
      pending: statusMap.pending,
      approved: statusMap.approved,
      paid: statusMap.paid,
      rejected: statusMap.rejected,
      total: { count: total_count, amount: total_amount }
    };
  }

  async getBudgetAllocationData(startDate: Date, endDate: Date): Promise<BudgetData> {
    const budgetCollection = this.db.collection('budgets');
    const paymentsCollection = this.db.collection('payments');

    // Get all budgets
    const budgets = await budgetCollection.find({}).toArray();

    // Get payments by category
    const paymentsByCategory = await paymentsCollection.aggregate([
      {
        $match: {
          status: 'paid',
          payment_date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$purpose',
          spent: { $sum: '$amount' }
        }
      }
    ]).toArray();

    const spentMap: any = {};
    paymentsByCategory.forEach((item: any) => {
      spentMap[item._id || 'Other'] = item.spent;
    });

    const categories = budgets.map((budget: any) => {
      const allocated = Number(budget.allocated_amount) || 0;
      const spent = spentMap[budget.category] || 0;
      const remaining = allocated - spent;
      const utilization_percentage = allocated > 0 ? (spent / allocated) * 100 : 0;

      return {
        name: budget.category || 'Uncategorized',
        allocated,
        spent,
        remaining,
        utilization_percentage
      };
    });

    const total_allocated = categories.reduce((sum, c) => sum + c.allocated, 0);
    const total_spent = categories.reduce((sum, c) => sum + c.spent, 0);
    const total_remaining = total_allocated - total_spent;

    return {
      categories,
      total_allocated,
      total_spent,
      total_remaining
    };
  }

  async getFinancialReportData(startDate: Date, endDate: Date): Promise<FinancialReportData> {
    const revenue = await this.getRevenueAndProfitData(startDate, endDate);
    const payment_status = await this.getPaymentStatusData(startDate, endDate);
    const budget = await this.getBudgetAllocationData(startDate, endDate);

    // Calculate summary
    const farmersCollection = this.db.collection('farmers');
    const total_farmers = await farmersCollection.countDocuments();

    const net_profit = revenue.total_revenue - budget.total_spent;
    const profit_margin = revenue.total_revenue > 0 ? (net_profit / revenue.total_revenue) * 100 : 0;

    return {
      period: { start_date: startDate, end_date: endDate },
      revenue,
      payment_status,
      budget,
      summary: {
        total_farmers,
        total_transactions: payment_status.total.count,
        net_profit,
        profit_margin
      }
    };
  }
}
