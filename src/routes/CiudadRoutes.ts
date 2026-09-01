import { Router } from 'express';

import {
  createCiudad,
  getCiudades,
  getCiudad,
  updateCiudad,
  deleteCiudad,
} from '../controllers/CiudadController.js';

import { authMiddleware } from '../middlewares/Auth.js';

const router = Router();

router.post('/', authMiddleware, createCiudad);

router.get('/', authMiddleware, getCiudades);

router.get('/:id', authMiddleware, getCiudad);

router.put('/:id', authMiddleware, updateCiudad);

router.delete('/:id', authMiddleware, deleteCiudad);

export default router;
