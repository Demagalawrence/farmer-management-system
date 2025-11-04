import { Router } from 'express';
import { FieldController } from '../controllers/fieldController';
import { authenticate, authorize } from '../middleware/auth';
import { validate, validateObjectId } from '../middleware/validation';

const router = Router();
const fieldController = new FieldController();

router.post('/', authenticate, authorize('field_officer', 'manager', 'farmer'), validate('createField'), fieldController.createField);
router.get('/:id', authenticate, validateObjectId('id'), fieldController.getFieldById);
router.get('/farmer/:farmerId', authenticate, validateObjectId('farmerId'), fieldController.getFieldsByFarmerId);
router.get('/', authenticate, fieldController.getAllFields);
router.put('/:id', authenticate, authorize('field_officer', 'manager', 'farmer'), validateObjectId('id'), validate('updateField'), fieldController.updateField);
router.delete('/:id', authenticate, authorize('field_officer', 'manager'), validateObjectId('id'), fieldController.deleteField);

export default router;