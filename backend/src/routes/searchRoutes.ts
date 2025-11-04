import { Router } from 'express';
import { SearchController } from '../controllers/searchController';
import { authenticate } from '../middleware/auth';
import { validateObjectId } from '../middleware/validation';

const router = Router();
const searchController = new SearchController();

router.get('/:id', authenticate, validateObjectId('id'), searchController.searchById);

export default router;
