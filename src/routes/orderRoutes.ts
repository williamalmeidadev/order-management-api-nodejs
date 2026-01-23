import { Router } from 'express';
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  searchOrders
} from '../controllers/orderController.js';
import { requireRole } from '../middleware/auth.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.get('/', getAllOrders);
router.get('/search', searchOrders);
router.get('/:id', getOrderById);
router.post('/', requireRole([ROLES.ADMIN]), createOrder);
router.put('/:id', requireRole([ROLES.ADMIN]), updateOrder);
router.delete('/:id', requireRole([ROLES.ADMIN]), deleteOrder);

export default router;
