import type { Request, Response } from 'express';
import sequelize from '../config/db.js';

import Inventario from '../models/Inventario.js';
import Almacen from '../models/Almacen.js';
import Medicamento from '../models/Medicamento.js';

// CREATE INVENTARIO

export const createInventario = async (req: Request, res: Response) => {
  try {
    const { almacen, medicamento, cantidad } = req.body;

    if (!almacen || !medicamento || cantidad === undefined) {
      return res.status(400).json({
        message: 'Almacen, medicamento and cantidad are required',
      });
    }

    const inventario = await sequelize.transaction(async (transaction) => {
      const almacenRecord = await Almacen.findOne({
        where: {
          nombre: almacen,
        },
        transaction,
      });

      if (!almacenRecord) {
        throw new Error('ALMACEN_NOT_FOUND');
      }

      const medicamentoRecord = await Medicamento.findOne({
        where: {
          nombre: medicamento,
        },
        transaction,
      });

      if (!medicamentoRecord) {
        throw new Error('MEDICAMENTO_NOT_FOUND');
      }

      const existingInventario = await Inventario.findOne({
        where: {
          almacenId: almacenRecord.id,
          medicamentoId: medicamentoRecord.id,
        },
        transaction,
      });

      if (existingInventario) {
        throw new Error('INVENTARIO_EXISTS');
      }

      return await Inventario.create(
        {
          almacenId: almacenRecord.id,
          medicamentoId: medicamentoRecord.id,
          cantidad,
        },
        {
          transaction,
        }
      );
    });

    return res.status(201).json({
      message: 'Inventario created successfully',
      inventario,
    });
  } catch (error) {
    console.error('Error creating inventario:', error);

    if (error instanceof Error) {
      if (error.message === 'ALMACEN_NOT_FOUND') {
        return res.status(404).json({
          message: 'Almacen not found',
        });
      }

      if (error.message === 'MEDICAMENTO_NOT_FOUND') {
        return res.status(404).json({
          message: 'Medicamento not found',
        });
      }

      if (error.message === 'INVENTARIO_EXISTS') {
        return res.status(409).json({
          message: 'This medicamento already exists in this almacen',
        });
      }
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET INVENTARIOS

export const getInventarios = async (req: Request, res: Response) => {
  try {
    const inventarios = await Inventario.findAll({
      include: [
        {
          model: Almacen,
          as: 'almacen',
        },
        {
          model: Medicamento,
          as: 'medicamento',
        },
      ],
    });

    return res.status(200).json(inventarios);
  } catch (error) {
    console.error('Error getting inventarios:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET INVENTARIO

export const getInventario = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const inventario = await Inventario.findByPk(id, {
      include: [
        {
          model: Almacen,
          as: 'almacen',
        },
        {
          model: Medicamento,
          as: 'medicamento',
        },
      ],
    });

    if (!inventario) {
      return res.status(404).json({
        message: 'Inventario not found',
      });
    }

    return res.status(200).json(inventario);
  } catch (error) {
    console.error('Error getting inventario:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// UPDATE INVENTARIO

export const updateInventario = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const { cantidad } = req.body;

    if (cantidad === undefined) {
      return res.status(400).json({
        message: 'Cantidad is required',
      });
    }

    const inventario = await sequelize.transaction(async (transaction) => {
      const inventario = await Inventario.findByPk(id, {
        transaction,
      });

      if (!inventario) {
        throw new Error('INVENTARIO_NOT_FOUND');
      }

      await inventario.update(
        {
          cantidad,
        },
        {
          transaction,
        }
      );

      return inventario;
    });

    return res.status(200).json({
      message: 'Inventario updated successfully',
      inventario,
    });
  } catch (error) {
    console.error('Error updating inventario:', error);

    if (error instanceof Error && error.message === 'INVENTARIO_NOT_FOUND') {
      return res.status(404).json({
        message: 'Inventario not found',
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// DELETE INVENTARIO

export const deleteInventario = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const inventario = await sequelize.transaction(async (transaction) => {
      const inventario = await Inventario.findByPk(id, {
        transaction,
      });

      if (!inventario) {
        throw new Error('INVENTARIO_NOT_FOUND');
      }

      await inventario.update(
        {
          estado: 'inactivo',
        },
        {
          transaction,
        }
      );

      return inventario;
    });

    return res.status(200).json({
      message: 'Inventario deactivated successfully',
      inventario,
    });
  } catch (error) {
    console.error('Error deleting inventario:', error);

    if (error instanceof Error && error.message === 'INVENTARIO_NOT_FOUND') {
      return res.status(404).json({
        message: 'Inventario not found',
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
