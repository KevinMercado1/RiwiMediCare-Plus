import { z } from 'zod';

export const createUsuarioSchema = z.object({
  nombre: z
    .string({ message: 'nombre debe ser un texto' })
    .min(3, 'nombre debe tener al menos 3 caracteres'),

  email: z
    .string({ message: 'email debe ser un texto' })
    .email('formato de email inválido'),

  password: z
    .string({ message: 'password debe ser un texto' })
    .min(8, 'password debe tener al menos 8 caracteres'),

  rol: z.enum(['administrador', 'gestor'], {
    message: 'rol debe ser administrador o gestor',
  }),

  estado: z
    .enum(['activo', 'inactivo'], {
      message: 'estado debe ser activo o inactivo',
    })
    .default('activo'),
});
