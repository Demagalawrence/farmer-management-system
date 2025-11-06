import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticate, authorize } from '../middleware/auth';
import { validate, validateObjectId } from '../middleware/validation';

const router = Router();
const reportController = new ReportController();

// Chart endpoints must come before parameterized routes
router.get('/charts/payments', authenticate, authorize('manager'), reportController.getPaymentChart.bind(reportController));
router.get('/charts/harvests', authenticate, authorize('manager'), reportController.getHarvestChart.bind(reportController));

router.post('/', authenticate, authorize('manager', 'finance', 'field_officer'), validate('generateReport'), reportController.createReport.bind(reportController));
router.get('/type/:type', authenticate, reportController.getReportsByType.bind(reportController));
router.get('/user/:userId', authenticate, validateObjectId('userId'), reportController.getReportsByUser.bind(reportController));
router.get('/', authenticate, authorize('manager', 'finance', 'field_officer'), reportController.getAllReports.bind(reportController));
router.get('/:id', authenticate, validateObjectId('id'), reportController.getReportById.bind(reportController));
router.put('/:id', authenticate, authorize('manager'), validateObjectId('id'), reportController.updateReport.bind(reportController));
router.delete('/:id', authenticate, authorize('manager'), validateObjectId('id'), reportController.deleteReport.bind(reportController));

export default router;