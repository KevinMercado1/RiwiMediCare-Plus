import type { Request, Response } from 'express';

import sequelize from '../config/db.js';

import DetalleSolicitud from '../models/DetalleSolicitud.js';
import Solicitud from '../models/Solicitud.js';
import Medicamento from '../models/Medicamento.js';

// CREATE DETALLE

export const createDetalleSolicitud = async (req: Request, res: Response) => {
  try {
    const { solicitudId, medicamentoCodigo, cantidadSolicitada } = req.body;

    // VALIDATIONS

    if (!solicitudId || !medicamentoCodigo || !cantidadSolicitada) {
      return res.status(400).json({
        message:
          'solicitudId, medicamentoCodigo and cantidadSolicitada are required',
      });
    }

    const detalle = await sequelize.transaction(async (transaction) => {
      const solicitud = await Solicitud.findByPk(solicitudId, {
        transaction,
      });

      if (!solicitud) {
        throw new Error('SOLICITUD_NOT_FOUND');
      }

      const medicamento = await Medicamento.findOne({
        where: {
          codigo: medicamentoCodigo,
        },
        transaction,
      });

      if (!medicamento) {
        throw new Error('MEDICAMENTO_NOT_FOUND');
      }

      const detalleExistente = await DetalleSolicitud.findOne({
        where: {
          solicitudId,
          medicamentoId: medicamento.id,
        },
        transaction,
      });

      if (detalleExistente) {
        throw new Error('DETAIL_EXISTS');
      }

      const newDetalle = await DetalleSolicitud.create(
        {
          solicitudId,
          medicamentoId: medicamento.id,
          cantidadSolicitada,
        },
        {
          transaction,
        }
      );

      return newDetalle;
    });

    return res.status(201).json({
      message: 'DetalleSolicitud created successfully',
      detalle,
    });
  } catch (error) {
    console.error('Error creating DetalleSolicitud:', error);

    if (error instanceof Error) {
      if (error.message === 'SOLICITUD_NOT_FOUND') {
        return res.status(404).json({
          message: 'Solicitud not found',
        });
      }

      if (error.message === 'MEDICAMENTO_NOT_FOUND') {
        return res.status(404).json({
          message: 'Medicamento not found',
        });
      }

      if (error.message === 'DETAIL_EXISTS') {
        return res.status(409).json({
          message: 'This medicamento is already in the solicitud',
        });
      }
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET DETALLES

export const getDetallesSolicitud = async (req: Request, res: Response) => {
  try {
    const detalles = await DetalleSolicitud.findAll({
      include: [
        {
          model: Medicamento,
          as: 'medicamento',
        },
        {
          model: Solicitud,
          as: 'solicitud',
        },
      ],
    });

    return res.status(200).json({
      detalles,
    });
  } catch (error) {
    console.error('Error getting Detalles:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// UPDATE DETALLE

export const updateDetalleSolicitud = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { cantidadSolicitada } = req.body;

    if (cantidadSolicitada === undefined) {
      return res.status(400).json({
        message: 'cantidadSolicitada is required',
      });
    }

    const detalle = await sequelize.transaction(async (transaction) => {
      const detalle = await DetalleSolicitud.findByPk(id, {
        transaction,
      });

      if (!detalle) {
        throw new Error('DETAIL_NOT_FOUND');
      }

      await detalle.update(
        {
          cantidadSolicitada,
        },
        {
          transaction,
        }
      );

      return detalle;
    });

    return res.status(200).json({
      message: 'DetalleSolicitud updated successfully',
      detalle,
    });
  } catch (error) {
    console.error('Error updating DetalleSolicitud:', error);

    if (error instanceof Error && error.message === 'DETAIL_NOT_FOUND') {
      return res.status(404).json({
        message: 'DetalleSolicitud not found',
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// DELETE DETALLE

export const deleteDetalleSolicitud = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    await sequelize.transaction(async (transaction) => {
      const detalle = await DetalleSolicitud.findByPk(id, {
        transaction,
      });

      if (!detalle) {
        throw new Error('DETAIL_NOT_FOUND');
      }

      await detalle.destroy({
        transaction,
      });
    });

    return res.status(200).json({
      message: 'DetalleSolicitud deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting DetalleSolicitud:', error);

    if (error instanceof Error && error.message === 'DETAIL_NOT_FOUND') {
      return res.status(404).json({
        message: 'DetalleSolicitud not found',
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
