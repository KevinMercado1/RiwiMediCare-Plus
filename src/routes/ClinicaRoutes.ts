import { Router } from 'express';

import {
  createClinica,
  getClinicas,
  getClinica,
  updateClinica,
  deleteClinica,
} from '../controllers/ClinicaController.js';

import { authMiddleware, authorizeRoles } from '../middlewares/Auth.js';

const router = Router();

router.post(
  '/',
  authMiddleware,
  authorizeRoles('administrador'),
  createClinica
);

router.get('/', authMiddleware, authorizeRoles('administrador'), getClinicas);

router.get('/:id', authMiddleware, authorizeRoles('administrador'), getClinica);

router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('administrador'),
  updateClinica
);

router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('administrador'),
  deleteClinica
);

export default router;
