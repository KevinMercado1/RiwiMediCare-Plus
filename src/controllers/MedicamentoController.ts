import type { Request, Response } from 'express';
import sequelize from '../config/db.js';
import Medicamento from '../models/Medicamento.js';

// CREATE MEDICAMENTO

export const createMedicamento = async (req: Request, res: Response) => {
  try {
    const { codigo, nombre, descripcion, precio } = req.body;

    if (!codigo || !nombre || precio === undefined) {
      return res.status(400).json({
        message: 'Codigo, nombre and precio are required',
      });
    }

    const medicamento = await sequelize.transaction(async (transaction) => {
      const existingMedicamento = await Medicamento.findOne({
        where: { codigo },
        transaction,
      });

      if (existingMedicamento) {
        throw new Error('CODIGO_EXISTS');
      }

      return await Medicamento.create(
        {
          codigo,
          nombre,
          descripcion,
          precio,
        },
        {
          transaction,
        }
      );
    });

    return res.status(201).json({
      message: 'Medicamento created successfully',
      medicamento,
    });
  } catch (error) {
    console.error('Error creating medicamento:', error);

    if (error instanceof Error && error.message === 'CODIGO_EXISTS') {
      return res.status(409).json({
        message: 'A medicamento with this codigo already exists',
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET MEDICAMENTOS

export const getMedicamentos = async (req: Request, res: Response) => {
  try {
    const medicamentos = await Medicamento.findAll({
      order: [['nombre', 'ASC']],
    });

    return res.status(200).json(medicamentos);
  } catch (error) {
    console.error('Error getting medicamentos:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET MEDICAMENTO

export const getMedicamento = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const medicamento = await Medicamento.findByPk(id);

    if (!medicamento) {
      return res.status(404).json({
        message: 'Medicamento not found',
      });
    }

    return res.status(200).json(medicamento);
  } catch (error) {
    console.error('Error getting medicamento:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// UPDATE MEDICAMENTO

export const updateMedicamento = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const { codigo, nombre, descripcion, precio } = req.body;

    const medicamento = await sequelize.transaction(async (transaction) => {
      const existingMedicamento = await Medicamento.findByPk(id, {
        transaction,
      });

      if (!existingMedicamento) {
        throw new Error('MEDICAMENTO_NOT_FOUND');
      }

      if (codigo) {
        const codigoExists = await Medicamento.findOne({
          where: { codigo },
          transaction,
        });

        if (codigoExists && codigoExists.id !== id) {
          throw new Error('CODIGO_EXISTS');
        }
      }

      await existingMedicamento.update(
        {
          ...(codigo !== undefined && { codigo }),
          ...(nombre !== undefined && { nombre }),
          ...(descripcion !== undefined && { descripcion }),
          ...(precio !== undefined && { precio }),
        },
        {
          transaction,
        }
      );

      return existingMedicamento;
    });

    return res.status(200).json({
      message: 'Medicamento updated successfully',
      medicamento,
    });
  } catch (error) {
    console.error('Error updating medicamento:', error);

    if (error instanceof Error) {
      if (error.message === 'MEDICAMENTO_NOT_FOUND') {
        return res.status(404).json({
          message: 'Medicamento not found',
        });
      }

      if (error.message === 'CODIGO_EXISTS') {
        return res.status(409).json({
          message: 'A medicamento with this codigo already exists',
        });
      }
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// DELETE MEDICAMENTO

export const deleteMedicamento = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    await sequelize.transaction(async (transaction) => {
      const medicamento = await Medicamento.findByPk(id, {
        transaction,
      });

      if (!medicamento) {
        throw new Error('MEDICAMENTO_NOT_FOUND');
      }

      await medicamento.destroy({
        transaction,
      });
    });

    return res.status(200).json({
      message: 'Medicamento deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting medicamento:', error);

    if (error instanceof Error && error.message === 'MEDICAMENTO_NOT_FOUND') {
      return res.status(404).json({
        message: 'Medicamento not found',
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
