import type { Request, Response } from 'express';
import Nit from '../models/Nit.js';

// CREATE NIT

export const createNit = async (req: Request, res: Response) => {
  try {
    const { numero } = req.body;

    // VALIDATIONS

    if (!numero) {
      return res.status(400).json({
        message: 'Numero is required',
      });
    }

    // CHECK NIT

    const existingNit = await Nit.findOne({
      where: {
        numero,
      },
    });

    if (existingNit) {
      return res.status(409).json({
        message: 'A NIT with this number already exists',
      });
    }

    // CREATE

    const nit = await Nit.create({
      numero,
    });

    return res.status(201).json({
      message: 'NIT created successfully',
      nit,
    });
  } catch (error) {
    console.error('Error creating NIT:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET NITS

export const getNits = async (req: Request, res: Response) => {
  try {
    const nits = await Nit.findAll({
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      nits,
    });
  } catch (error) {
    console.error('Error getting NITs:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET NIT

export const getNit = async (
  req: Request<{ numero: string }>,
  res: Response
) => {
  try {
    const { numero } = req.params;

    const nit = await Nit.findOne({
      where: {
        numero,
      },
    });

    if (!nit) {
      return res.status(404).json({
        message: 'NIT not found',
      });
    }

    return res.status(200).json(nit);
  } catch (error) {
    console.error('Error getting NIT:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// UPDATE NIT

export const updateNit = async (
  req: Request<{ numero: string }>,
  res: Response
) => {
  try {
    const { numero } = req.params;
    const { numero: nuevoNumero } = req.body;

    const nit = await Nit.findOne({
      where: {
        numero,
      },
    });

    if (!nit) {
      return res.status(404).json({
        message: 'NIT not found',
      });
    }

    // CHECK NEW NUMBER

    if (nuevoNumero && nuevoNumero !== nit.numero) {
      const existingNit = await Nit.findOne({
        where: {
          numero: nuevoNumero,
        },
      });

      if (existingNit) {
        return res.status(409).json({
          message: 'A NIT with this number already exists',
        });
      }

      nit.numero = nuevoNumero;
    }

    await nit.save();

    return res.status(200).json({
      message: 'NIT updated successfully',
      nit,
    });
  } catch (error) {
    console.error('Error updating NIT:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// DELETE NIT

export const deleteNit = async (
  req: Request<{ numero: string }>,
  res: Response
) => {
  try {
    const { numero } = req.params;

    const nit = await Nit.findOne({
      where: {
        numero,
      },
    });

    if (!nit) {
      return res.status(404).json({
        message: 'NIT not found',
      });
    }

    // LOGICAL DELETE

    await nit.update({
      estado: 'inactivo',
    });

    return res.status(200).json({
      message: 'NIT deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting NIT:', error);

    return res.status(500).json({
      message: 'NIT deleted successfully',
    });
  }
};
