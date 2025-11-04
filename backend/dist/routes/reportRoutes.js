"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const router = (0, express_1.Router)();
const reportController = new reportController_1.ReportController();
router.post('/', reportController.createReport);
router.get('/:id', reportController.getReportById);
router.get('/type/:type', reportController.getReportsByType);
router.get('/user/:userId', reportController.getReportsByUser);
router.get('/', reportController.getAllReports);
router.put('/:id', reportController.updateReport);
router.delete('/:id', reportController.deleteReport);
exports.default = router;
//# sourceMappingURL=reportRoutes.js.map