import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

export const permitirAcesso = (niveisPermitidos: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Usuário não autenticado' });
      return;
    }
    
    const { role } = req.user;
    if (niveisPermitidos.includes(role)) {
      return next();
    }
    
    res.status(403).json({ message: "Acesso negado para o seu departamento." });
  };
};
