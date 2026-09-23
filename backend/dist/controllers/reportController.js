"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const reportService_1 = require("../services/reportService");
let reportService;
const getReportService = () => {
    if (!reportService) {
        reportService = new reportService_1.ReportService();
    }
    return reportService;
};
class ReportController {
    async createReport(req, res) {
        try {
            const service = getReportService();
            const payload = { ...req.body };
            if (!payload.generated_by && req.user?.id) {
                payload.generated_by = req.user.id;
            }
            const report = await service.create(payload);
            res.status(201).json({ success: true, data: report });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    async getReportById(req, res) {
        try {
            const service = getReportService();
            const { id } = req.params;
            const report = await service.findById(id);
            if (!report) {
                res.status(404).json({ success: false, message: 'Report not found' });
                return;
            }
            res.status(200).json({ success: true, data: report });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getReportsByType(req, res) {
        try {
            const service = getReportService();
            const { type } = req.params;
            const reports = await service.findByType(type);
            res.status(200).json({ success: true, data: reports });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getReportsByUser(req, res) {
        try {
            const service = getReportService();
            const { userId } = req.params;
            const reports = await service.findByGeneratedBy(userId);
            res.status(200).json({ success: true, data: reports });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getAllReports(req, res) {
        try {
            const service = getReportService();
            const reports = await service.findAll();
            res.status(200).json({ success: true, data: reports });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async updateReport(req, res) {
        try {
            const service = getReportService();
            const { id } = req.params;
            const report = await service.update(id, req.body);
            if (!report) {
                res.status(404).json({ success: false, message: 'Report not found' });
                return;
            }
            res.status(200).json({ success: true, data: report });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async deleteReport(req, res) {
        try {
            const service = getReportService();
            const { id } = req.params;
            const result = await service.delete(id);
            if (!result) {
                res.status(404).json({ success: false, message: 'Report not found' });
                return;
            }
            res.status(200).json({ success: true, message: 'Report deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getPaymentChart(req, res) {
        try {
            const service = getReportService();
            const { start, end, interval = 'month' } = req.query;
            const startDate = start ? new Date(start) : new Date(new Date().getFullYear(), 0, 1);
            const endDate = end ? new Date(end) : new Date();
            const data = await service.aggregatePayments(startDate, endDate, String(interval));
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getHarvestChart(req, res) {
        try {
            const service = getReportService();
            const { start, end, interval = 'month' } = req.query;
            const startDate = start ? new Date(start) : new Date(new Date().getFullYear(), 0, 1);
            const endDate = end ? new Date(end) : new Date();
            const data = await service.aggregateHarvests(startDate, endDate, String(interval));
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.ReportController = ReportController;
//# sourceMappingURL=reportController.js.map