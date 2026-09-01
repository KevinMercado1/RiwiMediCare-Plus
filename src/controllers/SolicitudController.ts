import type { Request, Response } from 'express';

import sequelize from '../config/db.js';

import Solicitud from '../models/Solicitud.js';
import Clinica from '../models/Clinica.js';
import Almacen from '../models/Almacen.js';
import Usuario from '../models/Usuario.js';

// CREAR SOLICITUD

export const createSolicitud = async (req: Request, res: Response) => {
  try {
    const { clinica, almacen, usuario } = req.body;

    if (!clinica || !almacen || !usuario) {
      return res.status(400).json({
        message: 'clinica, almacen and usuario are required',
      });
    }

    const solicitud = await sequelize.transaction(async (transaction) => {
      const clinicaEncontrada = await Clinica.findOne({
        where: {
          nombre: clinica,
        },
        transaction,
      });

      if (!clinicaEncontrada) {
        throw new Error('CLINICA_NOT_FOUND');
      }

      const almacenEncontrado = await Almacen.findOne({
        where: {
          nombre: almacen,
        },
        transaction,
      });

      if (!almacenEncontrado) {
        throw new Error('ALMACEN_NOT_FOUND');
      }

      const usuarioEncontrado = await Usuario.findOne({
        where: {
          email: usuario,
        },
        transaction,
      });

      if (!usuarioEncontrado) {
        throw new Error('USUARIO_NOT_FOUND');
      }

      return await Solicitud.create(
        {
          clinicaId: clinicaEncontrada.id,
          almacenId: almacenEncontrado.id,
          usuarioId: usuarioEncontrado.id,
          estado: 'pendiente',
        },
        {
          transaction,
        }
      );
    });

    return res.status(201).json({
      message: 'Solicitud created successfully',
      solicitud,
    });
  } catch (error) {
    console.error('Error creating Solicitud:', error);

    if (error instanceof Error) {
      if (error.message === 'CLINICA_NOT_FOUND') {
        return res.status(404).json({
          message: 'Clinica not found',
        });
      }

      if (error.message === 'ALMACEN_NOT_FOUND') {
        return res.status(404).json({
          message: 'Almacen not found',
        });
      }

      if (error.message === 'USUARIO_NOT_FOUND') {
        return res.status(404).json({
          message: 'Usuario not found',
        });
      }
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET SOLICITUDES

export const getSolicitudes = async (req: Request, res: Response) => {
  try {
    const solicitudes = await Solicitud.findAll({
      include: [
        {
          model: Clinica,
          as: 'clinica',
        },
        {
          model: Almacen,
          as: 'almacen',
        },
        {
          model: Usuario,
          as: 'usuario',
        },
      ],
    });

    return res.status(200).json(solicitudes);
  } catch (error) {
    console.error('Error getting Solicitudes:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET SOLICITUD POR ID

export const getSolicitud = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const solicitud = await Solicitud.findByPk(id, {
      include: [
        {
          model: Clinica,
          as: 'clinica',
        },
        {
          model: Almacen,
          as: 'almacen',
        },
        {
          model: Usuario,
          as: 'usuario',
        },
      ],
    });

    if (!solicitud) {
      return res.status(404).json({
        message: 'Solicitud not found',
      });
    }

    return res.status(200).json(solicitud);
  } catch (error) {
    console.error('Error getting Solicitud:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET SOLICITUDES ACTIVAS

export const getSolicitudesActivas = async (req: Request, res: Response) => {
  try {
    const solicitudes = await Solicitud.findAll({
      where: {
        estado: 'pendiente',
      },
      include: [
        {
          model: Clinica,
          as: 'clinica',
        },
        {
          model: Almacen,
          as: 'almacen',
        },
        {
          model: Usuario,
          as: 'usuario',
        },
      ],
    });

    return res.status(200).json(solicitudes);
  } catch (error) {
    console.error('Error getting active solicitudes:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET HISTORIAL

export const getHistorialSolicitudes = async (req: Request, res: Response) => {
  try {
    const solicitudes = await Solicitud.findAll({
      include: [
        {
          model: Clinica,
          as: 'clinica',
        },
        {
          model: Almacen,
          as: 'almacen',
        },
        {
          model: Usuario,
          as: 'usuario',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(solicitudes);
  } catch (error) {
    console.error('Error getting solicitud history:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// UPDATE ESTADO

export const updateSolicitud = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({
        message: 'estado is required',
      });
    }

    const solicitud = await sequelize.transaction(async (transaction) => {
      const solicitudEncontrada = await Solicitud.findByPk(id, {
        transaction,
      });

      if (!solicitudEncontrada) {
        throw new Error('SOLICITUD_NOT_FOUND');
      }

      await solicitudEncontrada.update(
        {
          estado,
        },
        {
          transaction,
        }
      );

      return solicitudEncontrada;
    });

    return res.status(200).json({
      message: 'Solicitud updated successfully',
      solicitud,
    });
  } catch (error) {
    console.error('Error updating Solicitud:', error);

    if (error instanceof Error && error.message === 'SOLICITUD_NOT_FOUND') {
      return res.status(404).json({
        message: 'Solicitud not found',
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// DELETE LOGICO

export const deleteSolicitud = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    await sequelize.transaction(async (transaction) => {
      const solicitud = await Solicitud.findByPk(id, {
        transaction,
      });

      if (!solicitud) {
        throw new Error('SOLICITUD_NOT_FOUND');
      }

      await solicitud.update(
        {
          estado: 'cancelada',
        },
        {
          transaction,
        }
      );
    });

    return res.status(200).json({
      message: 'Solicitud cancelled successfully',
    });
  } catch (error) {
    console.error('Error deleting Solicitud:', error);

    if (error instanceof Error && error.message === 'SOLICITUD_NOT_FOUND') {
      return res.status(404).json({
        message: 'Solicitud not found',
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
