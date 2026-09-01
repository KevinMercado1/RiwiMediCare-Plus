import { Router } from 'express';

import {
  createInventario,
  getInventarios,
  getInventario,
  updateInventario,
  deleteInventario,
} from '../controllers/InventarioController.js';

import { authMiddleware, authorizeRoles } from '../middlewares/Auth.js';

const router = Router();

router.post(
  '/',
  authMiddleware,
  authorizeRoles('administrador'),
  createInventario
);

router.get(
  '/',
  authMiddleware,
  authorizeRoles('administrador'),
  getInventarios
);

router.get(
  '/:id',
  authMiddleware,
  authorizeRoles('administrador'),
  getInventario
);

router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('administrador'),
  updateInventario
);

router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('administrador'),
  deleteInventario
);

export default router;
