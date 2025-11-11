import express from 'express';
import accessCodeController from '../controllers/accessCodeController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Generate new access code (managers only)
router.post('/generate', authorize('manager'), accessCodeController.generateAccessCode);

// Get active access codes (managers only)
router.get('/active', authorize('manager'), accessCodeController.getActiveAccessCodes);

// Get access code history (managers only)
router.get('/history', authorize('manager'), accessCodeController.getAccessCodeHistory);

// Manually expire a code (managers only)
router.post('/expire', authorize('manager'), accessCodeController.expireAccessCode);

export default router;
