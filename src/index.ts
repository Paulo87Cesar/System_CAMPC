import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import passport from './config/passport';
import router from './routes/index';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Necessário para funcionar corretamente atrás do NGINX (proxy reverso)
if (isProd) {
  app.set('trust proxy', 1);
}

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// API routes
app.use('/api', router);

// Serve React build in production
if (isProd) {
  const frontendDist = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendDist));
  
  // Middleware de fallback para SPA (React)
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendDist, 'index.html'));
    } else {
      next();
    }
  });
} else {
  app.get('/', (_req, res) => {
    res.json({ status: 'ok', message: 'API ERP Jovem Aprendiz — Patrulheiros Campinas (dev)' });
  });
}

app.listen(port, () => {
  console.log(`✅ Servidor rodando em http://localhost:${port} [${isProd ? 'PRODUÇÃO' : 'dev'}]`);
});
