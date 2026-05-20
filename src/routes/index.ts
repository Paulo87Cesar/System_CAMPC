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
  ContratoController,
  FrequenciaController,
  OcorrenciaController,
  FeriadoController,
  FeriasJovemController,
  AtendimentoSocialController,
  QuestionarioSocioeconomicoController,
  ParecerSocialController,
  UsuarioController,
  PerfilAcessoController,
  EscolaController,
  ContratoEstagioController,
  DocumentoContratoController,
  AssinaturaDigitalController,
  FolhaPagamentoController,
  FaturaEmpresaController,
  EventoFinanceiroController,
  PlanoContaController,
  SeguradoraController,
  SeguroJovemController
} from '../controllers/index';

import { PdfController } from '../controllers/pdf.controller';


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
router.get('/jovens/:id/historico', JovemController.getHistorico);

crudRoutes(router, '/inscricoes', InscricaoController);
router.patch('/inscricoes/:id/aprovar', InscricaoController.aprovar);

crudRoutes(router, '/educadores', EducadorController);
crudRoutes(router, '/projetos', ProjetoController);
router.get('/projetos/:id/indicadores', ProjetoController.getIndicadores);
crudRoutes(router, '/programas', ProgramaController);
crudRoutes(router, '/cursos', CursoController);
crudRoutes(router, '/disciplinas', DisciplinaController);
crudRoutes(router, '/turmas', TurmaController);
router.get('/turmas/:id/diario', TurmaController.getDiario);
crudRoutes(router, '/matriculas', MatriculaController);
crudRoutes(router, '/boletim', BoletimController);
router.get('/boletim/matricula/:matriculaId', BoletimController.getByMatricula);

crudRoutes(router, '/empresas', EmpresaController);
crudRoutes(router, '/contratos', ContratoController);

// --- Phase 1 ---
crudRoutes(router, '/frequencias', FrequenciaController);
crudRoutes(router, '/ocorrencias', OcorrenciaController);
crudRoutes(router, '/feriados', FeriadoController);
crudRoutes(router, '/ferias_jovem', FeriasJovemController);

crudRoutes(router, '/atendimento_social', AtendimentoSocialController);
crudRoutes(router, '/questionario_socioeconomico', QuestionarioSocioeconomicoController);
crudRoutes(router, '/parecer_social', ParecerSocialController);

crudRoutes(router, '/usuarios', UsuarioController);
crudRoutes(router, '/perfil_acesso', PerfilAcessoController);

// --- Phase 2 ---
crudRoutes(router, '/escolas', EscolaController);
crudRoutes(router, '/contrato_estagio', ContratoEstagioController);
crudRoutes(router, '/documento_contrato', DocumentoContratoController);
crudRoutes(router, '/assinatura_digital', AssinaturaDigitalController);

crudRoutes(router, '/folha_pagamento', FolhaPagamentoController);
crudRoutes(router, '/fatura_empresa', FaturaEmpresaController);
crudRoutes(router, '/evento_financeiro', EventoFinanceiroController);
crudRoutes(router, '/plano_conta', PlanoContaController);
crudRoutes(router, '/seguradora', SeguradoraController);
crudRoutes(router, '/seguro_jovem', SeguroJovemController);

// Custom PDF Route
router.get('/pdf/recibo_pagamento/:id', PdfController.gerarReciboPagamento);

export default router;
