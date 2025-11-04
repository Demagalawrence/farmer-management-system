import { Router } from 'express';
import { FinanceController } from '../controllers/financeController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();
const controller = new FinanceController();

// Overview and aggregations
router.get('/overview', authenticate, authorize('finance', 'manager'), controller.getOverview);
router.get('/overbudget', authenticate, authorize('finance', 'manager'), controller.getOverbudget);
router.get('/transactions', authenticate, authorize('finance', 'manager'), controller.getRecentTransactions);

// Budgets
router.get('/budgets', authenticate, authorize('finance', 'manager'), controller.getBudgets);
router.post('/budgets', authenticate, authorize('finance', 'manager'), validate('createBudget'), controller.createBudget);
router.put('/budgets/:id', authenticate, authorize('finance', 'manager'), validate('updateBudget'), controller.updateBudget);

// Manager approval request for payments
router.post('/approvals/request', authenticate, authorize('finance', 'manager'), controller.requestManagerApproval);
router.get('/approvals', authenticate, authorize('manager', 'finance'), controller.listManagerApprovalRequests);
router.post('/approvals/:id/decision', authenticate, authorize('manager'), controller.decideManagerApprovalRequest);

export default router;

