import { z } from 'zod';

export const createCiudadSchema = z.object({
  nombre: z
    .string({ message: 'nombre debe ser un texto' })
    .min(2, 'nombre debe tener al menos 2 caracteres'),

  departamento: z
    .string({ message: 'departamento debe ser un texto' })
    .min(2, 'departamento debe tener al menos 2 caracteres'),
});
