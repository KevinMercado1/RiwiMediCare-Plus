import { z } from 'zod';

export const createTelefonoSchema = z.object({
  numero: z
    .string({ message: 'numero debe ser un texto' })
    .min(7, 'numero debe tener al menos 7 caracteres'),

  tipo: z
    .string({ message: 'tipo debe ser un texto' })
    .min(3, 'tipo debe tener al menos 3 caracteres')
    .default('movil'),
});
