import { Budget } from '../models/Budget';
export declare class FinanceService {
    private db;
    private budgets;
    constructor();
    getBudgets(period: string): Promise<Budget[]>;
    createBudget(input: Omit<Budget, '_id' | 'created_at' | 'updated_at'>): Promise<Budget>;
    updateBudget(id: string, update: Partial<Omit<Budget, '_id' | 'created_at'>>): Promise<Budget | null>;
    getOverview(period: string): Promise<any>;
    getOverbudget(period: string): Promise<Array<{
        category: string;
        allocated: number;
        spent: number;
        percent: number;
    }>>;
    getRecentTransactions(limit?: number): Promise<any[]>;
    createManagerApprovalRequest(input: {
        payment_ids: string[];
        note?: string;
        requested_by?: string | null;
    }): Promise<any>;
    listManagerApprovalRequests(status?: string): Promise<any[]>;
    decideManagerApprovalRequest(id: string, decision: 'approved' | 'denied', managerId?: string | null): Promise<any | null>;
}
//# sourceMappingURL=financeService.d.ts.map