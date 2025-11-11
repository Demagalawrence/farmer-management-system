import { Request, Response } from 'express';
export declare class FinanceController {
    getOverview(req: Request, res: Response): Promise<void>;
    getOverbudget(req: Request, res: Response): Promise<void>;
    getRecentTransactions(req: Request, res: Response): Promise<void>;
    getBudgets(req: Request, res: Response): Promise<void>;
    createBudget(req: Request, res: Response): Promise<void>;
    updateBudget(req: Request, res: Response): Promise<void>;
    requestManagerApproval(req: Request, res: Response): Promise<void>;
    listManagerApprovalRequests(req: Request, res: Response): Promise<void>;
    decideManagerApprovalRequest(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=financeController.d.ts.map