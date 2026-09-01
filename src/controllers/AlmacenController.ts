import type { Request, Response } from 'express';

import sequelize from '../config/db.js';

import Almacen from '../models/Almacen.js';
import Ciudad from '../models/Ciudad.js';

// CREATE ALMACEN

export const createAlmacen = async (req: Request, res: Response) => {
  try {
    const { nombre, ciudad, direccion } = req.body;

    // VALIDATIONS

    if (!nombre || !ciudad || !direccion) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const almacen = await sequelize.transaction(async (transaction) => {
      // CITY

      const [ciudadRecord] = await Ciudad.findOrCreate({
        where: {
          nombre: ciudad,
        },
        defaults: {
          nombre: ciudad,
          departamento: 'Sin especificar',
        },
        transaction,
      });

      // CHECK NAME

      const existingAlmacen = await Almacen.findOne({
        where: {
          nombre,
        },
        transaction,
      });

      if (existingAlmacen) {
        throw new Error('ALMACEN_EXISTS');
      }

      // CREATE

      const nuevoAlmacen = await Almacen.create(
        {
          nombre,
          ciudadId: ciudadRecord.id,
          direccion,
        },
        {
          transaction,
        }
      );

      return nuevoAlmacen;
    });

    const response = await Almacen.findByPk(almacen.id, {
      include: [
        {
          model: Ciudad,
          as: 'ciudad',
          attributes: ['id', 'nombre', 'departamento'],
        },
      ],
    });

    return res.status(201).json({
      message: 'Almacen created successfully',
      almacen: response,
    });
  } catch (error) {
    console.error('Error creating Almacen:', error);

    if (error instanceof Error) {
      if (error.message === 'ALMACEN_EXISTS') {
        return res.status(409).json({
          message: 'An almacen with this name already exists',
        });
      }
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET ALMACENES

export const getAlmacenes = async (req: Request, res: Response) => {
  try {
    const almacenes = await Almacen.findAll({
      include: [
        {
          model: Ciudad,
          as: 'ciudad',
          attributes: ['id', 'nombre', 'departamento'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      almacenes,
    });
  } catch (error) {
    console.error('Error getting Almacenes:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET ALMACEN

export const getAlmacen = async (
  req: Request<{ nombre: string }>,
  res: Response
) => {
  try {
    const { nombre } = req.params;

    const almacen = await Almacen.findOne({
      where: {
        nombre,
      },
      include: [
        {
          model: Ciudad,
          as: 'ciudad',
          attributes: ['id', 'nombre', 'departamento'],
        },
      ],
    });

    if (!almacen) {
      return res.status(404).json({
        message: 'Almacen not found',
      });
    }

    return res.status(200).json(almacen);
  } catch (error) {
    console.error('Error getting Almacen:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// UPDATE ALMACEN

export const updateAlmacen = async (
  req: Request<{ nombre: string }>,
  res: Response
) => {
  try {
    const { nombre } = req.params;

    const { nombre: nuevoNombre, ciudad, direccion } = req.body;

    const updatedAlmacen = await sequelize.transaction(async (transaction) => {
      // ALMACEN

      const almacen = await Almacen.findOne({
        where: {
          nombre,
        },
        transaction,
      });

      if (!almacen) {
        throw new Error('ALMACEN_NOT_FOUND');
      }

      // CHECK NEW NAME

      if (nuevoNombre && nuevoNombre !== almacen.nombre) {
        const existingAlmacen = await Almacen.findOne({
          where: {
            nombre: nuevoNombre,
          },
          transaction,
        });

        if (existingAlmacen) {
          throw new Error('ALMACEN_EXISTS');
        }

        almacen.nombre = nuevoNombre;
      }

      // CITY

      if (ciudad) {
        const ciudadRecord = await Ciudad.findOne({
          where: {
            nombre: ciudad,
          },
          transaction,
        });

        if (!ciudadRecord) {
          throw new Error('CITY_NOT_FOUND');
        }

        almacen.ciudadId = ciudadRecord.id;
      }

      // ADDRESS

      if (direccion !== undefined) {
        almacen.direccion = direccion;
      }

      await almacen.save({
        transaction,
      });

      return almacen;
    });

    const response = await Almacen.findByPk(updatedAlmacen.id, {
      include: [
        {
          model: Ciudad,
          as: 'ciudad',
          attributes: ['id', 'nombre', 'departamento'],
        },
      ],
    });

    return res.status(200).json({
      message: 'Almacen updated successfully',
      almacen: response,
    });
  } catch (error) {
    console.error('Error updating Almacen:', error);

    if (error instanceof Error) {
      if (error.message === 'ALMACEN_NOT_FOUND') {
        return res.status(404).json({
          message: 'Almacen not found',
        });
      }

      if (error.message === 'ALMACEN_EXISTS') {
        return res.status(409).json({
          message: 'An almacen with this name already exists',
        });
      }

      if (error.message === 'CITY_NOT_FOUND') {
        return res.status(404).json({
          message: 'City not found',
        });
      }
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// DELETE ALMACEN

export const deleteAlmacen = async (
  req: Request<{ nombre: string }>,
  res: Response
) => {
  try {
    const { nombre } = req.params;

    const almacen = await Almacen.findOne({
      where: {
        nombre,
      },
    });

    if (!almacen) {
      return res.status(404).json({
        message: 'Almacen not found',
      });
    }

    // LOGICAL DELETE

    await almacen.update({
      estado: 'inactivo',
    });

    return res.status(200).json({
      message: 'Almacen deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting Almacen:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
