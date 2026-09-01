import { Router } from 'express';

import {
  loginUsuario,
  createUsuario,
  getUsuarios,
  getUsuario,
  updateUsuario,
  deleteUsuario,
} from '../controllers/UsuarioController.js';

import { authMiddleware, authorizeRoles } from '../middlewares/Auth.js';

const router = Router();

router.post('/login', loginUsuario);

router.post('/', createUsuario);

router.get('/', authMiddleware, authorizeRoles('administrador'), getUsuarios);

router.get('/:id', authMiddleware, authorizeRoles('administrador'), getUsuario);

router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('administrador'),
  updateUsuario
);

router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('administrador'),
  deleteUsuario
);

export default router;
