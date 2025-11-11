"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
const reportController = new reportController_1.ReportController();
router.get('/charts/payments', auth_1.authenticate, (0, auth_1.authorize)('manager'), reportController.getPaymentChart.bind(reportController));
router.get('/charts/harvests', auth_1.authenticate, (0, auth_1.authorize)('manager'), reportController.getHarvestChart.bind(reportController));
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('manager', 'finance', 'field_officer'), (0, validation_1.validate)('generateReport'), reportController.createReport.bind(reportController));
router.get('/type/:type', auth_1.authenticate, reportController.getReportsByType.bind(reportController));
router.get('/user/:userId', auth_1.authenticate, (0, validation_1.validateObjectId)('userId'), reportController.getReportsByUser.bind(reportController));
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('manager', 'finance', 'field_officer'), reportController.getAllReports.bind(reportController));
router.get('/:id', auth_1.authenticate, (0, validation_1.validateObjectId)('id'), reportController.getReportById.bind(reportController));
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('manager'), (0, validation_1.validateObjectId)('id'), reportController.updateReport.bind(reportController));
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)('manager'), (0, validation_1.validateObjectId)('id'), reportController.deleteReport.bind(reportController));
exports.default = router;
//# sourceMappingURL=reportRoutes.js.map