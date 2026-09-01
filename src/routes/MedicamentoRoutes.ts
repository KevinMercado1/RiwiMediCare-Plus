import { Router } from 'express';

import {
  createMedicamento,
  getMedicamentos,
  getMedicamento,
  updateMedicamento,
  deleteMedicamento,
} from '../controllers/MedicamentoController.js';

import { authMiddleware, authorizeRoles } from '../middlewares/Auth.js';

const router = Router();

router.post(
  '/',
  authMiddleware,
  authorizeRoles('administrador'),
  createMedicamento
);

router.get(
  '/',
  authMiddleware,
  authorizeRoles('administrador'),
  getMedicamentos
);

router.get(
  '/:id',
  authMiddleware,
  authorizeRoles('administrador'),
  getMedicamento
);

router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('administrador'),
  updateMedicamento
);

router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('administrador'),
  deleteMedicamento
);

export default router;
