import { z } from 'zod';

export const createClinicaSchema = z.object({
  nombre: z
    .string({ message: 'nombre debe ser un texto' })
    .min(3, 'nombre debe tener al menos 3 caracteres'),

  nit: z
    .string({ message: 'nit debe ser un texto' })
    .min(5, 'nit debe tener al menos 5 caracteres'),

  direccion: z
    .string({ message: 'direccion debe ser un texto' })
    .min(5, 'direccion debe tener al menos 5 caracteres'),

  ciudadId: z
    .string({ message: 'ciudadId debe ser un UUID válido' })
    .uuid('ciudadId debe ser un UUID válido'),

  telefonoId: z
    .string({ message: 'telefonoId debe ser un UUID válido' })
    .uuid('telefonoId debe ser un UUID válido'),

  responsable: z
    .string({ message: 'responsable debe ser un texto' })
    .min(3, 'responsable debe tener al menos 3 caracteres'),
});
