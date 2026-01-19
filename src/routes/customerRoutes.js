import { Router } from 'express';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController.js';
import { requireRole } from '../middleware/auth.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.post('/', requireRole([ROLES.ADMIN]), createCustomer);
router.put('/:id', requireRole([ROLES.ADMIN]), updateCustomer);
router.delete('/:id', requireRole([ROLES.ADMIN]), deleteCustomer);

export default router;
