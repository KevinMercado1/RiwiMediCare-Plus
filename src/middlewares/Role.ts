import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './Auth.js';

type Rol = 'administrador' | 'gestor';

export const roleMiddleware = (...rolesPermitidos: Rol[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required',
      });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
};
