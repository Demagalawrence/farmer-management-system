import { Router } from 'express';
import { FarmerController } from '../controllers/farmerController';
import { authenticate, authorize } from '../middleware/auth';
import { validate, validateObjectId } from '../middleware/validation';

const router = Router();
const farmerController = new FarmerController();

router.post('/', authenticate, authorize('field_officer', 'manager'), validate('createFarmer'), farmerController.createFarmer);
router.get('/:id', authenticate, validateObjectId('id'), farmerController.getFarmerById);
router.get('/user/:userId', authenticate, validateObjectId('userId'), farmerController.getFarmerByUserId);
router.get('/', authenticate, farmerController.getAllFarmers);
router.put('/:id', authenticate, authorize('field_officer', 'manager'), validateObjectId('id'), validate('updateFarmer'), farmerController.updateFarmer);
router.delete('/:id', authenticate, authorize('manager'), validateObjectId('id'), farmerController.deleteFarmer);
router.post('/:id/fields', authenticate, authorize('field_officer', 'manager'), validateObjectId('id'), farmerController.addFieldToFarmer);

export default router;