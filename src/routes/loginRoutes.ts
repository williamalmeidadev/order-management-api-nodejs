import express from 'express';
import * as loginController from '../controllers/loginController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.post('/', loginController.login);

router.get('/verify', requireAuth, loginController.verifyToken);

router.get('/', requireAuth, loginController.getCurrentUser);

router.get('/all', requireAuth, requireRole([ROLES.ADMIN]), loginController.getAllUsers);

router.post('/create', requireAuth, requireRole([ROLES.ADMIN]), loginController.createUser);

router.get('/:username', requireAuth, requireRole([ROLES.ADMIN]), loginController.getUserByUsername);

router.put('/:username', requireAuth, requireRole([ROLES.ADMIN]), loginController.updateUser);

router.delete('/:username', requireAuth, requireRole([ROLES.ADMIN]), loginController.deleteUser);

export default router;
