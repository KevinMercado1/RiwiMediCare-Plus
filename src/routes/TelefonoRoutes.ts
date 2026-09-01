import { Router } from 'express';

import {
  createTelefono,
  getTelefonos,
  getTelefono,
  updateTelefono,
  deleteTelefono,
} from '../controllers/TelefonoController.js';

import { authMiddleware } from '../middlewares/Auth.js';

const router = Router();

router.post('/', authMiddleware, createTelefono);

router.get('/', authMiddleware, getTelefonos);

router.get('/:id', authMiddleware, getTelefono);

router.put('/:id', authMiddleware, updateTelefono);

router.delete('/:id', authMiddleware, deleteTelefono);

export default router;
