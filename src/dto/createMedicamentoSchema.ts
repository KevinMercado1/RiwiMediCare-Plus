import { z } from 'zod';

export const createMedicamentoSchema = z.object({
  codigo: z
    .string({ message: 'codigo debe ser un texto' })
    .min(2, 'codigo debe tener al menos 2 caracteres'),

  nombre: z
    .string({ message: 'nombre debe ser un texto' })
    .min(3, 'nombre debe tener al menos 3 caracteres'),

  descripcion: z
    .string({ message: 'descripcion debe ser un texto' })
    .nullable()
    .optional(),

  precio: z
    .number({ message: 'precio debe ser un número' })
    .min(0, 'precio no puede ser negativo'),
});
