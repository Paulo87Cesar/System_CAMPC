import { Router } from 'express';
import {
  JovemController,
  InscricaoController,
  EducadorController,
  ProjetoController,
  ProgramaController,
  CursoController,
  DisciplinaController,
  TurmaController,
  MatriculaController,
  BoletimController,
  DashboardController,
  EmpresaController,
  ContratoController
} from '../controllers/index';

import authRoutes from './auth.routes';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Rota pública de Auth
router.use('/auth', authRoutes);

// Todas as rotas abaixo requerem autenticação
router.use(authMiddleware);

function crudRoutes(r: Router, prefix: string, ctrl: Record<string, any>) {
  r.get(prefix, ctrl.getAll);
  r.get(`${prefix}/:id`, ctrl.getById);
  r.post(prefix, ctrl.create);
  r.put(`${prefix}/:id`, ctrl.update);
  r.delete(`${prefix}/:id`, ctrl.remove);
}

// Dashboard
router.get('/dashboard/stats', DashboardController.stats);

// Módulos
crudRoutes(router, '/jovens', JovemController);
crudRoutes(router, '/inscricoes', InscricaoController);
router.patch('/inscricoes/:id/aprovar', InscricaoController.aprovar);

crudRoutes(router, '/educadores', EducadorController);
crudRoutes(router, '/projetos', ProjetoController);
crudRoutes(router, '/programas', ProgramaController);
crudRoutes(router, '/cursos', CursoController);
crudRoutes(router, '/disciplinas', DisciplinaController);
crudRoutes(router, '/turmas', TurmaController);
crudRoutes(router, '/matriculas', MatriculaController);
crudRoutes(router, '/boletim', BoletimController);
router.get('/boletim/matricula/:matriculaId', BoletimController.getByMatricula);

crudRoutes(router, '/empresas', EmpresaController);
crudRoutes(router, '/contratos', ContratoController);

export default router;
