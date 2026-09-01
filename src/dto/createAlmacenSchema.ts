import { z } from 'zod';

export const createAlmacenSchema = z.object({
  nombre: z
    .string({ message: 'nombre debe ser un texto' })
    .min(3, 'nombre debe tener al menos 3 caracteres'),

  ciudadId: z
    .string({ message: 'ciudadId debe ser un UUID válido' })
    .uuid('ciudadId debe ser un UUID válido'),

  direccion: z
    .string({ message: 'direccion debe ser un texto' })
    .min(5, 'direccion debe tener al menos 5 caracteres'),
});
