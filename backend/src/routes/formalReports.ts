import { Router } from 'express';
import {
  generateFormalReport,
  downloadReport,
  viewReport,
  getUserReports,
  getReportRecipients
} from '../controllers/formalReportController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Generate formal PDF report
router.post('/generate-formal-report', generateFormalReport);

// Get list of reports for current user
router.get('/user-reports', getUserReports);

// Get available recipients for report distribution
router.get('/recipients', getReportRecipients);

// Download report as PDF
router.get('/download/:reportId', downloadReport);

// View report inline (PDF)
router.get('/view/:reportId', viewReport);

export default router;
