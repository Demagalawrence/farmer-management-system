"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceController = void 0;
const financeService_1 = require("../services/financeService");
let financeService;
const getService = () => {
    if (!financeService)
        financeService = new financeService_1.FinanceService();
    return financeService;
};
class FinanceController {
    async getOverview(req, res) {
        try {
            const { period = 'all' } = req.query;
            const data = await getService().getOverview(String(period));
            res.status(200).json({ success: true, data });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    async getOverbudget(req, res) {
        try {
            const { period = 'all' } = req.query;
            const data = await getService().getOverbudget(String(period));
            res.status(200).json({ success: true, data });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    async getRecentTransactions(req, res) {
        try {
            const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;
            const data = await getService().getRecentTransactions(limit);
            res.status(200).json({ success: true, data });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    async getBudgets(req, res) {
        try {
            const { period = 'all' } = req.query;
            const data = await getService().getBudgets(String(period));
            res.status(200).json({ success: true, data });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    async createBudget(req, res) {
        try {
            const data = await getService().createBudget(req.body);
            res.status(201).json({ success: true, data });
        }
        catch (e) {
            res.status(400).json({ success: false, message: e.message });
        }
    }
    async updateBudget(req, res) {
        try {
            const { id } = req.params;
            const data = await getService().updateBudget(id, req.body);
            if (!data) {
                res.status(404).json({ success: false, message: 'Budget not found' });
                return;
            }
            res.status(200).json({ success: true, data });
        }
        catch (e) {
            res.status(400).json({ success: false, message: e.message });
        }
    }
    async requestManagerApproval(req, res) {
        try {
            const { payment_ids = [], note = '' } = req.body || {};
            const userId = (req.user && req.user.id) || null;
            const data = await getService().createManagerApprovalRequest({ payment_ids, note, requested_by: userId });
            res.status(201).json({ success: true, data });
        }
        catch (e) {
            res.status(400).json({ success: false, message: e.message });
        }
    }
    async listManagerApprovalRequests(req, res) {
        try {
            const onlyPending = String(req.query.status || 'pending');
            const data = await getService().listManagerApprovalRequests(onlyPending);
            res.status(200).json({ success: true, data });
        }
        catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
    }
    async decideManagerApprovalRequest(req, res) {
        try {
            const { id } = req.params;
            const { decision } = req.body;
            const userId = (req.user && req.user.id) || null;
            const data = await getService().decideManagerApprovalRequest(id, decision, userId);
            if (!data) {
                res.status(404).json({ success: false, message: 'Request not found' });
                return;
            }
            res.status(200).json({ success: true, data });
        }
        catch (e) {
            res.status(400).json({ success: false, message: e.message });
        }
    }
}
exports.FinanceController = FinanceController;
//# sourceMappingURL=financeController.js.map