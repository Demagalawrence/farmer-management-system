import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';
import { authenticate, authorize } from '../middleware/auth';
import { validate, validateObjectId } from '../middleware/validation';

const router = Router();
const paymentController = new PaymentController();

// Field Officer payment requests
router.post('/request', authenticate, authorize('field_officer', 'finance', 'manager'), validate('createPaymentRequest'), paymentController.requestPayment);

router.post('/', authenticate, authorize('field_officer', 'finance', 'manager'), validate('createPayment'), paymentController.createPayment);
router.get('/:id', authenticate, validateObjectId('id'), paymentController.getPaymentById);
router.get('/farmer/:farmerId', authenticate, validateObjectId('farmerId'), paymentController.getPaymentsByFarmerId);
router.get('/status/:status', authenticate, paymentController.getPaymentsByStatus);
router.get('/', authenticate, authorize('finance', 'manager'), paymentController.getAllPayments);
router.put('/:id', authenticate, authorize('finance', 'manager'), validateObjectId('id'), validate('updatePayment'), paymentController.updatePayment);
router.delete('/:id', authenticate, authorize('manager'), validateObjectId('id'), paymentController.deletePayment);

export default router;