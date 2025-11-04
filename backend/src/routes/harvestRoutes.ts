import { Router } from 'express';
import { HarvestController } from '../controllers/harvestController';
import { authenticate, authorize } from '../middleware/auth';
import { validate, validateObjectId } from '../middleware/validation';

const router = Router();
const harvestController = new HarvestController();

router.post('/', authenticate, authorize('field_officer', 'manager'), validate('createHarvest'), harvestController.createHarvest);
router.get('/:id', authenticate, validateObjectId('id'), harvestController.getHarvestById);
router.get('/farmer/:farmerId', authenticate, validateObjectId('farmerId'), harvestController.getHarvestsByFarmerId);
router.get('/field/:fieldId', authenticate, validateObjectId('fieldId'), harvestController.getHarvestsByFieldId);
router.get('/', authenticate, harvestController.getAllHarvests);
router.put('/:id', authenticate, authorize('field_officer', 'manager'), validateObjectId('id'), validate('updateHarvest'), harvestController.updateHarvest);
router.delete('/:id', authenticate, authorize('manager'), validateObjectId('id'), harvestController.deleteHarvest);

export default router;