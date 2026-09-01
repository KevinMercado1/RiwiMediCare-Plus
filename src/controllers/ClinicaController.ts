import type { Request, Response } from 'express';

import sequelize from '../config/db.js';

import Clinica from '../models/Clinica.js';
import Ciudad from '../models/Ciudad.js';
import Telefono from '../models/Telefono.js';
import Nit from '../models/Nit.js';

// CREATE CLINICA

export const createClinica = async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      nit,
      direccion,
      ciudad,
      telefono,
      tipoTelefono,
      responsable,
    } = req.body;

    // VALIDATIONS

    if (!nombre || !nit || !direccion || !ciudad || !telefono || !responsable) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const clinica = await sequelize.transaction(async (transaction) => {
      // NIT

      const [nitRecord] = await Nit.findOrCreate({
        where: {
          numero: nit,
        },
        defaults: {
          numero: nit,
        },
        transaction,
      });

      // CHECK NIT

      const existingClinica = await Clinica.findOne({
        where: {
          nitId: nitRecord.id,
        },
        transaction,
      });

      if (existingClinica) {
        throw new Error('NIT_EXISTS');
      }

      // CIUDAD

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

      // TELEFONO

      const [telefonoRecord] = await Telefono.findOrCreate({
        where: {
          numero: telefono,
        },
        defaults: {
          numero: telefono,
          tipo: tipoTelefono || 'movil',
        },
        transaction,
      });

      // CLINICA

      const nuevaClinica = await Clinica.create(
        {
          nombre,
          nitId: nitRecord.id,
          direccion,
          ciudadId: ciudadRecord.id,
          telefonoId: telefonoRecord.id,
          responsable,
        },
        {
          transaction,
        }
      );

      return nuevaClinica;
    });

    const response = await Clinica.findByPk(clinica.id, {
      include: [
        {
          model: Nit,
          as: 'nit',
          attributes: ['id', 'numero'],
        },
        {
          model: Ciudad,
          as: 'ciudad',
          attributes: ['id', 'nombre', 'departamento'],
        },
        {
          model: Telefono,
          as: 'telefono',
          attributes: ['id', 'numero', 'tipo'],
        },
      ],
    });

    return res.status(201).json({
      message: 'Clinica created successfully',
      clinica: response,
    });
  } catch (error) {
    console.error('Error creating Clinica:', error);

    if (error instanceof Error) {
      if (error.message === 'NIT_EXISTS') {
        return res.status(409).json({
          message: 'A clinic with this NIT already exists',
        });
      }
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET CLINICAS

export const getClinicas = async (req: Request, res: Response) => {
  try {
    const clinicas = await Clinica.findAll({
      include: [
        {
          model: Nit,
          as: 'nit',
          attributes: ['id', 'numero'],
        },
        {
          model: Ciudad,
          as: 'ciudad',
          attributes: ['id', 'nombre', 'departamento'],
        },
        {
          model: Telefono,
          as: 'telefono',
          attributes: ['id', 'numero', 'tipo'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      clinicas,
    });
  } catch (error) {
    console.error('Error getting Clinicas:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET CLINICA

export const getClinica = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const clinica = await Clinica.findByPk(id, {
      include: [
        {
          model: Nit,
          as: 'nit',
          attributes: ['id', 'numero'],
        },
        {
          model: Ciudad,
          as: 'ciudad',
          attributes: ['id', 'nombre', 'departamento'],
        },
        {
          model: Telefono,
          as: 'telefono',
          attributes: ['id', 'numero', 'tipo'],
        },
      ],
    });

    if (!clinica) {
      return res.status(404).json({
        message: 'Clinica not found',
      });
    }

    return res.status(200).json(clinica);
  } catch (error) {
    console.error('Error getting Clinica:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// UPDATE CLINICA

export const updateClinica = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const {
      nombre: nuevoNombre,
      nit,
      direccion,
      ciudad,
      telefono,
      tipoTelefono,
      responsable,
    } = req.body;

    const updatedClinica = await sequelize.transaction(async (transaction) => {
      const clinica = await Clinica.findByPk(id, {
        transaction,
      });

      if (!clinica) {
        throw new Error('CLINICA_NOT_FOUND');
      }

      // NIT

      if (nit) {
        const nitRecord = await Nit.findOne({
          where: {
            numero: nit,
          },
          transaction,
        });

        if (!nitRecord) {
          throw new Error('NIT_NOT_FOUND');
        }

        const existingClinica = await Clinica.findOne({
          where: {
            nitId: nitRecord.id,
          },
          transaction,
        });

        if (existingClinica && existingClinica.id !== clinica.id) {
          throw new Error('NIT_EXISTS');
        }

        clinica.nitId = nitRecord.id;
      }

      // CIUDAD

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

        clinica.ciudadId = ciudadRecord.id;
      }

      // TELEFONO

      if (telefono) {
        const telefonoRecord = await Telefono.findOne({
          where: {
            numero: telefono,
          },
          transaction,
        });

        if (!telefonoRecord) {
          throw new Error('PHONE_NOT_FOUND');
        }

        clinica.telefonoId = telefonoRecord.id;

        if (tipoTelefono) {
          await telefonoRecord.update(
            {
              tipo: tipoTelefono,
            },
            {
              transaction,
            }
          );
        }
      }

      // DATA

      if (nuevoNombre !== undefined) {
        clinica.nombre = nuevoNombre;
      }

      if (direccion !== undefined) {
        clinica.direccion = direccion;
      }

      if (responsable !== undefined) {
        clinica.responsable = responsable;
      }

      await clinica.save({
        transaction,
      });

      return clinica;
    });

    return res.status(200).json({
      message: 'Clinica updated successfully',
      clinica: updatedClinica,
    });
  } catch (error) {
    console.error('Error updating Clinica:', error);

    if (error instanceof Error) {
      if (error.message === 'CLINICA_NOT_FOUND') {
        return res.status(404).json({
          message: 'Clinica not found',
        });
      }

      if (error.message === 'NIT_NOT_FOUND') {
        return res.status(404).json({
          message: 'NIT not found',
        });
      }

      if (error.message === 'NIT_EXISTS') {
        return res.status(409).json({
          message: 'A clinic with this NIT already exists',
        });
      }

      if (error.message === 'CITY_NOT_FOUND') {
        return res.status(404).json({
          message: 'City not found',
        });
      }

      if (error.message === 'PHONE_NOT_FOUND') {
        return res.status(404).json({
          message: 'Phone not found',
        });
      }
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// DELETE CLINICA

export const deleteClinica = async (
  req: Request<{ nombre: string }>,
  res: Response
) => {
  try {
    const { nombre } = req.params;

    const clinica = await Clinica.findOne({
      where: {
        nombre,
      },
    });

    if (!clinica) {
      return res.status(404).json({
        message: 'Clinica not found',
      });
    }

    // LOGICAL DELETE

    await clinica.update({
      estado: 'inactivo',
    });

    return res.status(200).json({
      message: 'Clinica deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting Clinica:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
