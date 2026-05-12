import jwt from 'jsonwebtoken';
import pool from '../config/database';

export async function determinarNivelAcesso(email: string) {
  try {
    const [rows]: any = await pool.query(
      `SELECT p.nome as role 
       FROM usuario u 
       JOIN perfil_acesso p ON u.perfil_id = p.id 
       WHERE u.email = ? AND u.ativo = 1`,
      [email]
    );

    if (rows.length > 0) {
      return rows[0].role.toLowerCase();
    }
    
    return 'educador'; // Padrão se não encontrado ou inativo
  } catch (error) {
    console.error('Erro ao determinar nível de acesso:', error);
    return 'educador';
  }
}

export const AuthController: any = {
  login: async (req: any, res: any) => {
    const { username, password } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET || 'secret';
    const ADMIN_USER = process.env.ADMIN_USER || 'admin';
    const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

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

  googleCallback: async (req: any, res: any) => {
    const user = req.user as any;
    const email = user.emails[0].value;
    const displayName = user.displayName || email.split('@')[0];
    
    const nivel = await determinarNivelAcesso(email);

    const token = jwt.sign(
      { id: user.id, username: displayName, email: email, role: nivel },
      process.env.JWT_SECRET!,
      { expiresIn: '8h' }
    );

    // Redireciona para o frontend com o token
    // FRONTEND_URL define a URL base do frontend (ex.: https://sys.patrulheiros.org.br)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login-success?token=${token}`);
  },

  me: async (req: any, res: any) => {
    const u = req.user as any;
    res.json({
      user: {
        username: u.username || u.email || 'Usuário',
        role: u.role || 'educador'
      }
    });
  }
};
