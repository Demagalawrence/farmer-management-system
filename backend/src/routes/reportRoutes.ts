import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticate, authorize } from '../middleware/auth';
import { validate, validateObjectId } from '../middleware/validation';

const router = Router();
const reportController = new ReportController();

router.post('/', authenticate, authorize('manager', 'finance', 'field_officer'), validate('generateReport'), reportController.createReport);
router.get('/:id', authenticate, validateObjectId('id'), reportController.getReportById);
router.get('/type/:type', authenticate, reportController.getReportsByType);
router.get('/user/:userId', authenticate, validateObjectId('userId'), reportController.getReportsByUser);
router.get('/', authenticate, authorize('manager', 'finance', 'field_officer'), reportController.getAllReports);
router.put('/:id', authenticate, authorize('manager'), validateObjectId('id'), reportController.updateReport);
router.delete('/:id', authenticate, authorize('manager'), validateObjectId('id'), reportController.deleteReport);

export default router;