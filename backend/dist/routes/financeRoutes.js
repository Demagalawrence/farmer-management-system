"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const financeController_1 = require("../controllers/financeController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
const controller = new financeController_1.FinanceController();
router.get('/overview', auth_1.authenticate, (0, auth_1.authorize)('finance', 'manager'), controller.getOverview);
router.get('/overbudget', auth_1.authenticate, (0, auth_1.authorize)('finance', 'manager'), controller.getOverbudget);
router.get('/transactions', auth_1.authenticate, (0, auth_1.authorize)('finance', 'manager'), controller.getRecentTransactions);
router.get('/budgets', auth_1.authenticate, (0, auth_1.authorize)('finance', 'manager'), controller.getBudgets);
router.post('/budgets', auth_1.authenticate, (0, auth_1.authorize)('finance', 'manager'), (0, validation_1.validate)('createBudget'), controller.createBudget);
router.put('/budgets/:id', auth_1.authenticate, (0, auth_1.authorize)('finance', 'manager'), (0, validation_1.validate)('updateBudget'), controller.updateBudget);
router.post('/approvals/request', auth_1.authenticate, (0, auth_1.authorize)('finance', 'manager'), controller.requestManagerApproval);
router.get('/approvals', auth_1.authenticate, (0, auth_1.authorize)('manager', 'finance'), controller.listManagerApprovalRequests);
router.post('/approvals/:id/decision', auth_1.authenticate, (0, auth_1.authorize)('manager'), controller.decideManagerApprovalRequest);
exports.default = router;
//# sourceMappingURL=financeRoutes.js.map