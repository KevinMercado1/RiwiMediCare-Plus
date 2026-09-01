import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
