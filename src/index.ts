import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import router from './routes/index';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', router);

// Serve React build in production
if (isProd) {
  const frontendDist = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.json({ status: 'ok', message: 'API ERP Jovem Aprendiz — Patrulheiros Campinas (dev)' });
  });
}

app.listen(port, () => {
  console.log(`✅ Servidor rodando em http://localhost:${port} [${isProd ? 'PRODUÇÃO' : 'dev'}]`);
});
