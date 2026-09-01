import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import sequelize from '../config/db.js';
import Usuario from '../models/Usuario.js';

// LOGIN USUARIO

export const loginUsuario = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const usuario = await Usuario.findOne({
      where: {
        email,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        message: 'Usuario not found',
      });
    }

    if (usuario.estado === 'inactivo') {
      return res.status(403).json({
        message: 'Usuario is inactive',
      });
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1d',
      }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        estado: usuario.estado,
      },
    });
  } catch (error) {
    console.error('Error login Usuario:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// CREATE USUARIO

export const createUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({
        message: 'Nombre, email, password and rol are required',
      });
    }

    if (!['administrador', 'gestor'].includes(rol)) {
      return res.status(400).json({
        message: 'Invalid rol',
      });
    }

    const usuario = await sequelize.transaction(async (transaction) => {
      const existingUsuario = await Usuario.findOne({
        where: {
          email,
        },
        transaction,
      });

      if (existingUsuario) {
        throw new Error('EMAIL_EXISTS');
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newUsuario = await Usuario.create(
        {
          nombre,
          email,
          password: passwordHash,
          rol,
          estado: 'activo',
        },
        {
          transaction,
        }
      );

      return newUsuario;
    });

    return res.status(201).json({
      message: 'Usuario created successfully',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        estado: usuario.estado,
      },
    });
  } catch (error) {
    console.error('Error creating Usuario:', error);

    if (error instanceof Error && error.message === 'EMAIL_EXISTS') {
      return res.status(409).json({
        message: 'A user with this email already exists',
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET USUARIOS

export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: {
        exclude: ['password'],
      },
      order: [['nombre', 'ASC']],
    });

    return res.status(200).json({
      usuarios,
    });
  } catch (error) {
    console.error('Error getting Usuarios:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// GET USUARIO

export const getUsuario = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, {
      attributes: {
        exclude: ['password'],
      },
    });

    if (!usuario) {
      return res.status(404).json({
        message: 'Usuario not found',
      });
    }

    return res.status(200).json(usuario);
  } catch (error) {
    console.error('Error getting Usuario:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// UPDATE USUARIO

export const updateUsuario = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const { nombre, email, password, rol, estado } = req.body;

    const usuario = await sequelize.transaction(async (transaction) => {
      const existingUsuario = await Usuario.findByPk(id, {
        transaction,
      });

      if (!existingUsuario) {
        throw new Error('USUARIO_NOT_FOUND');
      }

      if (email) {
        const emailExists = await Usuario.findOne({
          where: {
            email,
          },
          transaction,
        });

        if (emailExists && emailExists.id !== id) {
          throw new Error('EMAIL_EXISTS');
        }
      }

      const updateData: {
        nombre?: string;
        email?: string;
        password?: string;
        rol?: 'administrador' | 'gestor';
        estado?: 'activo' | 'inactivo';
      } = {};

      if (nombre !== undefined) {
        updateData.nombre = nombre;
      }

      if (email !== undefined) {
        updateData.email = email;
      }

      if (password !== undefined) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      if (rol !== undefined) {
        updateData.rol = rol;
      }

      if (estado !== undefined) {
        updateData.estado = estado;
      }

      await existingUsuario.update(updateData, {
        transaction,
      });

      return existingUsuario;
    });

    return res.status(200).json({
      message: 'Usuario updated successfully',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        estado: usuario.estado,
      },
    });
  } catch (error) {
    console.error('Error updating Usuario:', error);

    if (error instanceof Error) {
      if (error.message === 'USUARIO_NOT_FOUND') {
        return res.status(404).json({
          message: 'Usuario not found',
        });
      }

      if (error.message === 'EMAIL_EXISTS') {
        return res.status(409).json({
          message: 'A user with this email already exists',
        });
      }
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// DELETE USUARIO

export const deleteUsuario = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    await sequelize.transaction(async (transaction) => {
      const usuario = await Usuario.findByPk(id, {
        transaction,
      });

      if (!usuario) {
        throw new Error('USUARIO_NOT_FOUND');
      }

      await usuario.update(
        {
          estado: 'inactivo',
        },
        {
          transaction,
        }
      );
    });

    return res.status(200).json({
      message: 'Usuario deactivated successfully',
    });
  } catch (error) {
    console.error('Error deleting Usuario:', error);

    if (error instanceof Error && error.message === 'USUARIO_NOT_FOUND') {
      return res.status(404).json({
        message: 'Usuario not found',
      });
    }

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
