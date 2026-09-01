import { Router } from 'express';

import {
  createSolicitud,
  getSolicitudes,
  getSolicitud,
  updateSolicitud,
  deleteSolicitud,
  getSolicitudesActivas,
  getHistorialSolicitudes,
} from '../controllers/SolicitudController.js';

import { authMiddleware, authorizeRoles } from '../middlewares/Auth.js';

const router = Router();

// GESTOR

router.post(
  '/',
  authMiddleware,
  authorizeRoles('gestor', 'administrador'),
  createSolicitud
);

// ADMINISTRADOR + GESTOR

router.get(
  '/',
  authMiddleware,
  authorizeRoles('administrador', 'gestor'),
  getSolicitudes
);

router.get(
  '/activas',
  authMiddleware,
  authorizeRoles('administrador', 'gestor'),
  getSolicitudesActivas
);

router.get(
  '/historial',
  authMiddleware,
  authorizeRoles('administrador', 'gestor'),
  getHistorialSolicitudes
);

router.get(
  '/:id',
  authMiddleware,
  authorizeRoles('administrador', 'gestor'),
  getSolicitud
);

// ACTUALIZAR ESTADO

router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('administrador', 'gestor'),
  updateSolicitud
);

// SOLO ADMINISTRADOR

router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('administrador'),
  deleteSolicitud
);

export default router;
