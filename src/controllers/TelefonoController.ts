import type { Request, Response } from 'express';
import Telefono from '../models/Telefono.js';

// CREATE TELEFONO

export const createTelefono = async (req: Request, res: Response) => {
  try {
    const { numero, tipo } = req.body;

    // VALIDATIONS

    if (!numero || !tipo) {
      return res.status(400).json({
        message: 'Numero and tipo are required',
      });
    }

    // CHECK PHONE

    const existingTelefono = await Telefono.findOne({
      where: {
        numero,
      },
    });

    if (existingTelefono) {
      return res.status(409).json({
        message: 'A phone with this number already exists',
      });
    }

    // CREATE

    const telefono = await Telefono.create({
      numero,
      tipo,
    });

    return res.status(201).json({
      message: 'Telefono created successfully',
      telefono,
    });
  } catch (error) {
    console.error('Error creating Telefono:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET TELEFONOS

export const getTelefonos = async (req: Request, res: Response) => {
  try {
    const telefonos = await Telefono.findAll({
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      telefonos,
    });
  } catch (error) {
    console.error('Error getting Telefonos:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET TELEFONO

export const getTelefono = async (
  req: Request<{ numero: string }>,
  res: Response
) => {
  try {
    const { numero } = req.params;

    const telefono = await Telefono.findOne({
      where: {
        numero,
      },
    });

    if (!telefono) {
      return res.status(404).json({
        message: 'Telefono not found',
      });
    }

    return res.status(200).json(telefono);
  } catch (error) {
    console.error('Error getting Telefono:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// UPDATE TELEFONO

export const updateTelefono = async (
  req: Request<{ numero: string }>,
  res: Response
) => {
  try {
    const { numero } = req.params;

    const { numero: nuevoNumero, tipo } = req.body;

    const telefono = await Telefono.findOne({
      where: {
        numero,
      },
    });

    if (!telefono) {
      return res.status(404).json({
        message: 'Telefono not found',
      });
    }

    // CHECK NEW NUMBER

    if (nuevoNumero && nuevoNumero !== telefono.numero) {
      const existingTelefono = await Telefono.findOne({
        where: {
          numero: nuevoNumero,
        },
      });

      if (existingTelefono) {
        return res.status(409).json({
          message: 'A phone with this number already exists',
        });
      }

      telefono.numero = nuevoNumero;
    }

    // UPDATE DATA

    if (tipo !== undefined) {
      telefono.tipo = tipo;
    }

    await telefono.save();

    return res.status(200).json({
      message: 'Telefono updated successfully',
      telefono,
    });
  } catch (error) {
    console.error('Error updating Telefono:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// DELETE TELEFONO

export const deleteTelefono = async (
  req: Request<{ numero: string }>,
  res: Response
) => {
  try {
    const { numero } = req.params;

    const telefono = await Telefono.findOne({
      where: {
        numero,
      },
    });

    if (!telefono) {
      return res.status(404).json({
        message: 'Telefono not found',
      });
    }

    // LOGICAL DELETE

    await telefono.update({
      estado: 'inactivo',
    });

    return res.status(200).json({
      message: 'Telefono deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting Telefono:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
