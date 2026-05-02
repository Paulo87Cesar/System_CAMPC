import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

export const AuthController: Record<string, RequestHandler> = {
  login: async (req, res) => {
    const { username, password } = req.body;

    // Simplificação solicitada: nível administrador
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const token = jwt.sign(
        { id: 0, username: ADMIN_USER, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.json({
        token,
        user: { username: ADMIN_USER, role: 'admin' }
      });
      return;
    }

    res.status(401).json({ message: 'Usuário ou senha inválidos' });
  },

  me: async (req: any, res) => {
    res.json({ user: req.user });
  }
};
