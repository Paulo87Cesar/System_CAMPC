import { RequestHandler } from 'express';
import { BaseModel } from '../models/base.model';
import pool from '../config/database';

// Helper para traduzir erros comuns de SQL para Português-BR
function handleSqlError(e: any, res: any) {
  let message = 'Não foi possível salvar os dados. Verifique os campos e tente novamente.';
  
  if (e.code === 'ER_DUP_ENTRY') {
    message = 'Este registro (CPF, CNPJ ou Código) já existe no sistema.';
  } else if (e.code === 'ER_NO_REFERENCED_ROW_2') {
    message = 'Selecione uma opção válida nos campos de seleção (Curso, Educador, etc).';
  } else if (e.code === 'ER_BAD_FIELD_ERROR') {
    message = 'Erro de estrutura: Um dos campos enviados não é aceito pelo banco de dados.';
  } else if (e.code === 'ER_DATA_TOO_LONG') {
    message = 'O texto digitado é muito grande para um dos campos.';
  } else if (e.code === 'ER_TRUNCATED_WRONG_VALUE' || e.code === 'ER_WRONG_VALUE_COUNT_ON_ROW') {
    message = 'Valor inválido preenchido em um dos campos (verifique números e datas).';
  }

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
        `SELECT id_jovem, matricula, nome_completo, cpf, genero, municipio,
                email, telefone, celular, aprovacao_status, inativo, data_cadastro
         FROM cadastro_jovem ORDER BY nome_completo`
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  }
};

// --- Inscrições controller ---
export const InscricaoController: Record<string, RequestHandler> = {
  ...crudController('inscricao_2026', 'id'),
  getAll: async (_req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT id, nome_completo, cpf, data_nascimento, projeto, email,
                telefone, status_processo, data_cadastro
         FROM inscricao_2026 ORDER BY data_cadastro DESC`
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  },
  aprovar: async (req, res) => {
    try {
      await pool.query(
        `UPDATE inscricao_2026 SET status_processo = 'Aprovado' WHERE id = ?`,
        [req.params.id]
      );
      res.json({ message: 'Inscrição aprovada — jovem criado via trigger' });
    } catch (e: any) { handleSqlError(e, res); }
  }
};

// --- Educadores ---
export const EducadorController = crudController('educador', 'id_educador');

// --- Projetos ---
export const ProjetoController = crudController('projeto', 'id_projeto');

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
         JOIN programa pg ON pg.id_programa = c.id_programa ORDER BY c.nome_curso`
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
