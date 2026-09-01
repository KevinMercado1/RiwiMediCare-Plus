import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    rol: 'administrador' | 'gestor';
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'Token required',
      });
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      return res.status(401).json({
        message: 'Invalid token format',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      rol: 'administrador' | 'gestor';
    };

    req.user = {
      id: decoded.id,
      rol: decoded.rol,
    };

    next();
  } catch {
    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
};

export const authorizeRoles = (...roles: Array<'administrador' | 'gestor'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        message: 'You do not have permission to access this resource',
      });
    }

    next();
  };
};
