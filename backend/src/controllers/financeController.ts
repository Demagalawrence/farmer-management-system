import { Request, Response } from 'express';
import { FinanceService } from '../services/financeService';

let financeService: FinanceService;
const getService = () => {
  if (!financeService) financeService = new FinanceService();
  return financeService;
};

export class FinanceController {
  async getOverview(req: Request, res: Response): Promise<void> {
    try {
      const { period = 'all' } = req.query as any;
      const data = await getService().getOverview(String(period));
      res.status(200).json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  }

  async getOverbudget(req: Request, res: Response): Promise<void> {
    try {
      const { period = 'all' } = req.query as any;
      const data = await getService().getOverbudget(String(period));
      res.status(200).json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  }

  async getRecentTransactions(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;
      const data = await getService().getRecentTransactions(limit);
      res.status(200).json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  }

  async getBudgets(req: Request, res: Response): Promise<void> {
    try {
      const { period = 'all' } = req.query as any;
      const data = await getService().getBudgets(String(period));
      res.status(200).json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  }

  async createBudget(req: Request, res: Response): Promise<void> {
    try {
      const data = await getService().createBudget(req.body);
      res.status(201).json({ success: true, data });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  async updateBudget(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await getService().updateBudget(id, req.body);
      if (!data) {
        res.status(404).json({ success: false, message: 'Budget not found' });
        return;
      }
      res.status(200).json({ success: true, data });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  async requestManagerApproval(req: Request, res: Response): Promise<void> {
    try {
      const { payment_ids = [], note = '' } = req.body || {};
      const userId = (req.user && (req.user as any).id) || null;
      const data = await getService().createManagerApprovalRequest({ payment_ids, note, requested_by: userId });
      res.status(201).json({ success: true, data });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  async listManagerApprovalRequests(req: Request, res: Response): Promise<void> {
    try {
      const onlyPending = String(req.query.status || 'pending');
      const data = await getService().listManagerApprovalRequests(onlyPending);
      res.status(200).json({ success: true, data });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e.message });
    }
  }

  async decideManagerApprovalRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { decision } = req.body as any; // 'approved' | 'denied'
      const userId = (req.user && (req.user as any).id) || null;
      const data = await getService().decideManagerApprovalRequest(id, decision, userId);
      if (!data) {
        res.status(404).json({ success: false, message: 'Request not found' });
        return;
      }
      res.status(200).json({ success: true, data });
    } catch (e: any) {
      res.status(400).json({ success: false, message: e.message });
    }
  }
}
