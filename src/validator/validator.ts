import { body } from 'express-validator';

export const loginUsuarioValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be valid'),

  body('password').notEmpty().withMessage('Password is required'),
];

export const createUsuarioValidator = [
  body('nombre').trim().notEmpty().withMessage('Nombre is required'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be valid'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must have at least 6 characters'),

  body('rol')
    .trim()
    .notEmpty()
    .withMessage('Rol is required')
    .isIn(['administrador', 'gestor'])
    .withMessage('Invalid rol'),
];

export const updateUsuarioValidator = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Nombre cannot be empty'),

  body('email').optional().trim().isEmail().withMessage('Email must be valid'),

  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must have at least 6 characters'),

  body('rol')
    .optional()
    .trim()
    .isIn(['administrador', 'gestor'])
    .withMessage('Invalid rol'),

  body('estado')
    .optional()
    .trim()
    .isIn(['activo', 'inactivo'])
    .withMessage('Invalid estado'),
];
