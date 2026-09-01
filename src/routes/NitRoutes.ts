import { Router } from 'express';

import {
  createNit,
  getNits,
  getNit,
  updateNit,
  deleteNit,
} from '../controllers/NitController.js';

import { authMiddleware } from '../middlewares/Auth.js';

const router = Router();

router.post('/', authMiddleware, createNit);

router.get('/', authMiddleware, getNits);

router.get('/:id', authMiddleware, getNit);

router.put('/:id', authMiddleware, updateNit);

router.delete('/:id', authMiddleware, deleteNit);

export default router;
