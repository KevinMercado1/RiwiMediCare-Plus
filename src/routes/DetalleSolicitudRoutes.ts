import { Router } from 'express';

import {
  createDetalleSolicitud,
  getDetallesSolicitud,
  updateDetalleSolicitud,
  deleteDetalleSolicitud,
} from '../controllers/DetalleSolicitudController.js';

import { authMiddleware } from '../middlewares/Auth.js';

const router = Router();

router.post('/', authMiddleware, createDetalleSolicitud);

router.get('/', authMiddleware, getDetallesSolicitud);

router.put('/:id', authMiddleware, updateDetalleSolicitud);

router.delete('/:id', authMiddleware, deleteDetalleSolicitud);

export default router;
