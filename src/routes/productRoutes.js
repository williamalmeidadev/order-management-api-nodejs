import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { requireRole } from '../middleware/auth.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', requireRole([ROLES.ADMIN]), createProduct);
router.put('/:id', requireRole([ROLES.ADMIN]), updateProduct);
router.delete('/:id', requireRole([ROLES.ADMIN]), deleteProduct);

export default router;
