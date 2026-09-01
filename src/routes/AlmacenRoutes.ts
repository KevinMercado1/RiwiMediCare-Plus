import { Router } from 'express';

import {
  createAlmacen,
  getAlmacenes,
  getAlmacen,
  updateAlmacen,
  deleteAlmacen,
} from '../controllers/AlmacenController.js';

import { authMiddleware, authorizeRoles } from '../middlewares/Auth.js';

const router = Router();

router.post(
  '/',
  authMiddleware,
  authorizeRoles('administrador'),
  createAlmacen
);

router.get('/', authMiddleware, authorizeRoles('administrador'), getAlmacenes);

router.get('/:id', authMiddleware, authorizeRoles('administrador'), getAlmacen);

router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('administrador'),
  updateAlmacen
);

router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('administrador'),
  deleteAlmacen
);

export default router;
