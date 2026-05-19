import { RequestHandler } from 'express';
import { BaseModel } from '../models/base.model';
import pool from '../config/database';

// Helper para traduzir erros comuns de SQL para Português-BR
function handleSqlError(e: any, res: any) {
  // Tenta extrair o nome da coluna ou valor se disponível na mensagem do MySQL
  const columnMatch = e.sqlMessage ? e.sqlMessage.match(/'([^']+)'/) : null;
  const columnName = columnMatch ? `[${columnMatch[1]}]` : '';

  let message = `Erro técnico (${e.code || 'Desconhecido'}): ${e.sqlMessage || e.message}`;
  
  if (e.code === 'ER_DUP_ENTRY') {
    message = `O valor enviado para o campo ${columnName} já existe no sistema.`;
  } else if (e.code === 'ER_NO_REFERENCED_ROW_2') {
    message = `O registro selecionado no campo ${columnName} não foi encontrado.`;
  } else if (e.code === 'ER_BAD_FIELD_ERROR') {
    message = `O campo ${columnName} não é aceito por esta tabela. Verifique a estrutura do banco.`;
  } else if (e.code === 'ER_BAD_NULL_ERROR') {
    message = `O campo ${columnName} é obrigatório e não pode ficar vazio.`;
  } else if (e.code === 'ER_DATA_TOO_LONG') {
    message = `O texto no campo ${columnName} é muito longo.`;
  } else if (e.code === 'ER_TRUNCATED_WRONG_VALUE' || e.code === 'ER_WRONG_VALUE_COUNT_ON_ROW') {
    message = `O valor enviado para o campo ${columnName} é inválido para este tipo de coluna.`;
  }

  console.error('Final Error Message:', message);
  res.status(400).json({ message });
}

// --- Generic CRUD factory ---
export function crudController(table: string, idCol: string): Record<string, RequestHandler> {
  return {
    getAll: async (req, res) => {
      try {
        const rows = await BaseModel.findAll(table);
        res.json(rows);
      } catch (e: any) {
        handleSqlError(e, res);
      }
    },
    getById: async (req, res) => {
      try {
        const row = await BaseModel.findById(table, idCol, Number(req.params.id));
        if (!row) { res.status(404).json({ message: 'Registro não encontrado' }); return; }
        res.json(row);
      } catch (e: any) {
        handleSqlError(e, res);
      }
    },
    create: async (req, res) => {
      try {
        const result: any = await BaseModel.insert(table, req.body);
        res.status(201).json({ [idCol]: result.insertId, ...req.body });
      } catch (e: any) {
        handleSqlError(e, res);
      }
    },
    update: async (req, res) => {
      try {
        await BaseModel.update(table, idCol, Number(req.params.id), req.body);
        res.json({ message: 'Updated successfully' });
      } catch (e: any) {
        handleSqlError(e, res);
      }
    },
    remove: async (req, res) => {
      try {
        await BaseModel.remove(table, idCol, Number(req.params.id));
        res.json({ message: 'Deleted successfully' });
      } catch (e: any) {
        handleSqlError(e, res);
      }
    }
  };
}

// --- Jovens controller (extended) ---
export const JovemController: Record<string, RequestHandler> = {
  ...crudController('cadastro_jovem', 'id_jovem'),
  getAll: async (_req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT *, DATE_FORMAT(nascimento, '%Y-%m-%d') as nascimento,
                   DATE_FORMAT(data_cadastro, '%Y-%m-%d') as data_cadastro,
                   DATE_FORMAT(data_emissao_rg, '%Y-%m-%d') as data_emissao_rg
         FROM cadastro_jovem ORDER BY nome_completo`
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  }
};

async function syncJovemAprovado(id: number) {
  const [inscRows] = await pool.query(`SELECT * FROM inscricao_2026 WHERE id = ?`, [id]) as any[];
  const insc = inscRows[0];
  if (!insc || insc.status_processo !== 'Aprovado') return;

  const [jovemRows] = await pool.query(`SELECT id_jovem FROM cadastro_jovem WHERE id_inscricao = ?`, [id]) as any[];
  if (jovemRows.length > 0) return; // already exists

  await pool.query(
    `INSERT INTO cadastro_jovem (
      id_inscricao, nome_completo, cpf, rg, data_cadastro, genero, nascimento, 
      estado_civil, cor_raca, destro_canhoto, pcd, deficiencia_descricao, 
      telefone, celular, email, cep, endereco, numero, bairro, municipio, 
      escolaridade, escola, periodo, serie, ra, ja_trabalhou, ctps_assinada, aprovacao_status
    ) VALUES (?, ?, ?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Aprovado')`,
    [
      insc.id, insc.nome_completo, insc.cpf, insc.rg, insc.sexo, insc.data_nascimento,
      insc.estado_civil, insc.cor_raca, insc.destro_canhoto, insc.is_deficiente, insc.deficiencia_descricao,
      insc.telefone, insc.tel_contato, insc.email, insc.end_cep, insc.end_logradouro, insc.end_numero, insc.end_bairro, insc.end_cidade,
      insc.escola_escolaridade, insc.escola_nome, insc.escola_periodo, insc.escola_serie, insc.escola_ra, insc.ja_trabalhou, insc.ctps_assinada
    ]
  );
}

// --- Inscrições controller ---
export const InscricaoController: Record<string, RequestHandler> = {
  ...crudController('inscricao_2026', 'id'),
  getAll: async (_req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT *, DATE_FORMAT(data_nascimento, '%Y-%m-%d') as data_nascimento 
         FROM inscricao_2026 ORDER BY data_cadastro DESC`
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  },
  update: async (req, res) => {
    try {
      await BaseModel.update('inscricao_2026', 'id', Number(req.params.id), req.body);
      if (req.body.status_processo === 'Aprovado') {
        await syncJovemAprovado(Number(req.params.id));
      }
      res.json({ message: 'Updated successfully' });
    } catch (e: any) { handleSqlError(e, res); }
  },
  aprovar: async (req, res) => {
    try {
      await pool.query(
        `UPDATE inscricao_2026 SET status_processo = 'Aprovado' WHERE id = ?`,
        [req.params.id]
      );
      await syncJovemAprovado(Number(req.params.id));
      res.json({ message: 'Inscrição aprovada e jovem cadastrado!' });
    } catch (e: any) { handleSqlError(e, res); }
  }
};

// --- Educadores ---
export const EducadorController = crudController('educador', 'id_educador');

// --- Projetos ---
export const ProjetoController: Record<string, RequestHandler> = {
  ...crudController('projeto', 'id_projeto'),
  getAll: async (_req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT id_projeto, nome_projeto, descricao, 
                DATE_FORMAT(data_inicio, '%Y-%m-%d') as data_inicio, 
                DATE_FORMAT(data_fim, '%Y-%m-%d') as data_fim, 
                ativo, criado_em 
         FROM projeto ORDER BY id_projeto DESC`
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  }
};

// --- Programas ---
export const ProgramaController: Record<string, RequestHandler> = {
  ...crudController('programa', 'id_programa'),
  getAll: async (_req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT pg.*, p.nome_projeto FROM programa pg
         JOIN projeto p ON p.id_projeto = pg.id_projeto ORDER BY pg.ano DESC`
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  }
};

// --- Cursos ---
export const CursoController: Record<string, RequestHandler> = {
  ...crudController('curso', 'id_curso'),
  getAll: async (_req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT c.*, pg.nome_programa FROM curso c
         LEFT JOIN programa pg ON pg.id_programa = c.id_programa ORDER BY c.nome_curso`
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  }
};

// --- Disciplinas ---
export const DisciplinaController: Record<string, RequestHandler> = {
  ...crudController('disciplina', 'id_disciplina'),
  getAll: async (_req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT d.*, c.nome_curso FROM disciplina d
         JOIN curso c ON c.id_curso = d.id_curso ORDER BY d.id_curso, d.ordem`
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  }
};

// --- Turmas ---
export const TurmaController: Record<string, RequestHandler> = {
  ...crudController('turma', 'id_turma'),
  getAll: async (_req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT t.*, c.nome_curso, e.nome AS nome_educador
         FROM turma t
         JOIN curso c ON c.id_curso = t.id_curso
         LEFT JOIN educador e ON e.id_educador = t.id_educador
         ORDER BY t.data_inicio DESC`
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  }
};

// --- Matrículas ---
export const MatriculaController: Record<string, RequestHandler> = {
  ...crudController('matricula_turma', 'id_matricula'),
  getAll: async (_req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT mt.*, j.nome_completo AS nome_jovem, t.codigo_turma
         FROM matricula_turma mt
         JOIN cadastro_jovem j ON j.id_jovem = mt.id_jovem
         JOIN turma t ON t.id_turma = mt.id_turma
         ORDER BY mt.data_matricula DESC`
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  }
};

// --- Boletim ---
export const BoletimController: Record<string, RequestHandler> = {
  ...crudController('boletim_nota', 'id_nota'),
  getByMatricula: async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT bn.*, d.nome_disciplina FROM boletim_nota bn
         JOIN disciplina d ON d.id_disciplina = bn.id_disciplina
         WHERE bn.id_matricula = ? ORDER BY d.ordem`,
        [req.params.matriculaId]
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  }
};

// --- Empresas ---
export const EmpresaController = crudController('empresa', 'id_empresa');

// --- Contratos ---
export const ContratoController: Record<string, RequestHandler> = {
  ...crudController('contrato_aprendiz', 'id_contrato'),
  getAll: async (_req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT c.*, j.nome_completo AS nome_jovem, e.nome_fantasia AS nome_empresa
         FROM contrato_aprendiz c
         JOIN cadastro_jovem j ON j.id_jovem = c.id_jovem
         JOIN empresa e ON e.id_empresa = c.id_empresa
         ORDER BY c.data_inicio DESC`
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  }
};

// --- Dashboard Stats ---
export const DashboardController: Record<string, RequestHandler> = {
  stats: async (_req, res) => {
    try {
      const [[jovensRow]]: any = await pool.query(`SELECT COUNT(*) AS total FROM cadastro_jovem`);
      const [[inscricoesRow]]: any = await pool.query(`SELECT COUNT(*) AS total FROM inscricao_2026`);
      const [[turmasRow]]: any = await pool.query(`SELECT COUNT(*) AS total FROM turma WHERE ativo = 'S'`);
      const [[educadoresRow]]: any = await pool.query(`SELECT COUNT(*) AS total FROM educador WHERE ativo = 'S'`);
      const [[empresasRow]]: any = await pool.query(`SELECT COUNT(*) AS total FROM empresa WHERE ativo = 'S'`);
      const [[contratosRow]]: any = await pool.query(`SELECT COUNT(*) AS total FROM contrato_aprendiz WHERE status_contrato = 'Ativo'`);

      const [porStatus]: any = await pool.query(
        `SELECT status_processo, COUNT(*) AS total FROM inscricao_2026 GROUP BY status_processo`
      );
      const [matriculasPorStatus]: any = await pool.query(
        `SELECT status_matricula, COUNT(*) AS total FROM matricula_turma GROUP BY status_matricula`
      );
      res.json({
        jovens: jovensRow.total,
        inscricoes: inscricoesRow.total,
        turmasAtivas: turmasRow.total,
        educadores: educadoresRow.total,
        empresasAtivas: empresasRow.total,
        contratosAtivos: contratosRow.total,
        inscricoesPorStatus: porStatus,
        matriculasPorStatus
      });
    } catch (e: any) { handleSqlError(e, res); }
  }
};

// --- Phase 1: Frequência e Ocorrências ---
export const FrequenciaController = crudController('frequencia', 'id');
export const OcorrenciaController = crudController('ocorrencia', 'id');
export const FeriadoController = crudController('feriado', 'id');
export const FeriasJovemController = crudController('ferias_jovem', 'id');

// --- Phase 1: Social / Psicóloga ---
export const AtendimentoSocialController = crudController('atendimento_social', 'id');
export const QuestionarioSocioeconomicoController = crudController('questionario_socioeconomico', 'id');
export const ParecerSocialController = crudController('parecer_social', 'id');

// --- Phase 1: Usuários e Permissões ---
export const UsuarioController = crudController('usuario', 'id');
export const PerfilAcessoController = crudController('perfil_acesso', 'id');

// --- Phase 2: Contratos (Estágio e Outros) ---
export const EscolaController = crudController('escola', 'id');
export const ContratoEstagioController = crudController('contrato_estagio', 'id');
export const DocumentoContratoController = crudController('documento_contrato', 'id');
export const AssinaturaDigitalController = crudController('assinatura_digital', 'id');

// --- Phase 2: Financeiro ---
export const FolhaPagamentoController = crudController('folha_pagamento', 'id');
export const FaturaEmpresaController = crudController('fatura_empresa', 'id');
export const EventoFinanceiroController = crudController('evento_financeiro', 'id');
export const PlanoContaController = crudController('plano_conta', 'id');
export const SeguradoraController = crudController('seguradora', 'id');
export const SeguroJovemController = crudController('seguro_jovem', 'id');
