import type { Request, Response } from 'express';

import Ciudad from '../models/Ciudad.js';

// CREATE CIUDAD

export const createCiudad = async (req: Request, res: Response) => {
  try {
    const { nombre, departamento } = req.body;

    // VALIDATIONS

    if (
      typeof nombre !== 'string' ||
      typeof departamento !== 'string' ||
      !nombre.trim() ||
      !departamento.trim()
    ) {
      return res.status(400).json({
        message: 'Nombre and departamento are required',
      });
    }

    const nombreCiudad = nombre.trim();
    const nombreDepartamento = departamento.trim();

    // CHECK CITY

    const existingCiudad = await Ciudad.findOne({
      where: {
        nombre: nombreCiudad,
      },
    });

    if (existingCiudad) {
      return res.status(409).json({
        message: 'A city with this name already exists',
      });
    }

    // CREATE

    const ciudad = await Ciudad.create({
      nombre: nombreCiudad,
      departamento: nombreDepartamento,
      estado: 'activo',
    });

    return res.status(201).json({
      message: 'Ciudad created successfully',
      ciudad,
    });
  } catch (error) {
    console.error('Error creating Ciudad:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET CIUDADES

export const getCiudades = async (req: Request, res: Response) => {
  try {
    const ciudades = await Ciudad.findAll({
      order: [['nombre', 'ASC']],
    });

    return res.status(200).json({
      ciudades,
    });
  } catch (error) {
    console.error('Error getting Ciudades:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET CIUDAD

export const getCiudad = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const ciudad = await Ciudad.findByPk(id);

    if (!ciudad) {
      return res.status(404).json({
        message: 'Ciudad not found',
      });
    }

    return res.status(200).json(ciudad);
  } catch (error) {
    console.error('Error getting Ciudad:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// UPDATE CIUDAD

export const updateCiudad = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const { nombre, departamento } = req.body;

    const ciudad = await Ciudad.findByPk(id);

    if (!ciudad) {
      return res.status(404).json({
        message: 'Ciudad not found',
      });
    }

    // VALIDATIONS

    if (nombre !== undefined) {
      if (typeof nombre !== 'string' || !nombre.trim()) {
        return res.status(400).json({
          message: 'Nombre cannot be empty',
        });
      }
    }

    if (departamento !== undefined) {
      if (typeof departamento !== 'string' || !departamento.trim()) {
        return res.status(400).json({
          message: 'Departamento cannot be empty',
        });
      }
    }

    // CHECK NEW NAME

    if (nombre && nombre.trim() !== ciudad.nombre) {
      const existingCiudad = await Ciudad.findOne({
        where: {
          nombre: nombre.trim(),
        },
      });

      if (existingCiudad) {
        return res.status(409).json({
          message: 'A city with this name already exists',
        });
      }

      ciudad.nombre = nombre.trim();
    }

    // UPDATE DEPARTAMENTO

    if (departamento !== undefined) {
      ciudad.departamento = departamento.trim();
    }

    await ciudad.save();

    return res.status(200).json({
      message: 'Ciudad updated successfully',
      ciudad,
    });
  } catch (error) {
    console.error('Error updating Ciudad:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// DELETE CIUDAD

export const deleteCiudad = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const ciudad = await Ciudad.findByPk(id);

    if (!ciudad) {
      return res.status(404).json({
        message: 'Ciudad not found',
      });
    }

    // LOGICAL DELETE

    await ciudad.update({
      estado: 'inactivo',
    });

    return res.status(200).json({
      message: 'Ciudad deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting Ciudad:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
