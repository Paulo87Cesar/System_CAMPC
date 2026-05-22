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
  },
  getHistorico: async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT 
            j.matricula AS matricula_institucional,
            j.nome_completo AS nome_jovem,
            proj.nome_projeto,
            prog.nome_programa,
            c.nome_curso,
            t.codigo_turma,
            mt.status_matricula AS situacao_na_turma,
            d.nome_disciplina,
            b.periodo_avaliacao,
            IFNULL(b.nota, 'Sem nota') AS nota_avaliacao,
            IFNULL(b.faltas, 0) AS faltas_disciplina
        FROM cadastro_jovem j
        JOIN matricula_turma mt ON j.id_jovem = mt.id_jovem
        JOIN turma t ON mt.id_turma = t.id_turma
        JOIN curso c ON t.id_curso = c.id_curso
        JOIN programa prog ON c.id_programa = prog.id_programa
        JOIN projeto proj ON prog.id_projeto = proj.id_projeto
        LEFT JOIN disciplina d ON c.id_curso = d.id_curso
        LEFT JOIN boletim_nota b ON mt.id_matricula = b.id_matricula AND d.id_disciplina = b.id_disciplina
        WHERE j.id_jovem = ?
        ORDER BY t.data_inicio DESC, d.ordem ASC`,
        [req.params.id]
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  }
};

async function syncJovemAprovado(id: number) {
  console.log(`syncJovemAprovado called for inscricao id ${id}`);
  try {
    const [inscRows] = await pool.query(`SELECT * FROM inscricao WHERE id = ?`, [id]) as any[];
    const insc = inscRows[0];
    if (!insc || insc.status_processo !== 'Aprovado') {
      console.log('Inscrição not approved or missing; skipping.');
      return;
    }

    const [jovemRows] = await pool.query(`SELECT id_jovem FROM cadastro_jovem WHERE id_inscricao = ?`, [id]) as any[];
    if (jovemRows.length > 0) {
      console.log('Jovem already exists for this inscrição; skipping.');
      return; // already exists
    }

    // Generate automatic matricula: YEAR + 4-digit sequence
    const currentYear = new Date().getFullYear();
    const [[seqRow]]: any = await pool.query(
      `SELECT MAX(CAST(SUBSTRING(matricula,5) AS UNSIGNED)) AS max_seq FROM cadastro_jovem WHERE matricula LIKE ?`,
      [`${currentYear}%`]
    );
    const nextSeq = (seqRow?.max_seq ?? 0) + 1;
    const generatedMatricula = `${currentYear}${String(nextSeq).padStart(4, '0')}`;
    console.log(`Generated matricula: ${generatedMatricula}`);

    await pool.query(
      `INSERT INTO cadastro_jovem (
        id_inscricao, matricula, nome_completo, cpf, rg, data_cadastro, genero, nascimento, estado_civil, cor_raca, destro_canhoto, pcd, deficiencia_descricao,
        telefone, celular, email, cep, endereco, numero, bairro, municipio,
        escolaridade, escola, periodo, serie, ra, ja_trabalhou, ctps_assinada, aprovacao_status
      ) VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Aprovado')`,
      [
        insc.id, generatedMatricula, insc.nome_completo, insc.cpf, insc.rg, insc.sexo, insc.data_nascimento,
        insc.estado_civil, insc.cor_raca, insc.destro_canhoto, insc.is_deficiente, insc.deficiencia_descricao,
        insc.telefone, insc.tel_contato, insc.email, insc.end_cep, insc.end_logradouro, insc.end_numero, insc.end_bairro, insc.end_cidade,
        insc.escola_escolaridade, insc.escola_nome, insc.escola_periodo, insc.escola_serie, insc.escola_ra, insc.ja_trabalhou, insc.ctps_assinada, 'Aprovado'
      ]
    );
    console.log('Inserted new cadastro_jovem record.');


  } catch (err) {
    console.error('Error in syncJovemAprovado:', err);
    throw err; // will be caught by outer handler
  }
}

// --- Inscrições controller ---
export const InscricaoController: Record<string, RequestHandler> = {
  ...crudController('inscricao', 'id'),
  getAll: async (_req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT *, DATE_FORMAT(data_nascimento, '%Y-%m-%d') as data_nascimento 
         FROM inscricao WHERE ano_processo = 2026 ORDER BY data_cadastro DESC`
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  },
  update: async (req, res) => {
    try {
      await BaseModel.update('inscricao', 'id', Number(req.params.id), req.body);
      if (req.body.status_processo === 'Aprovado') {
        await syncJovemAprovado(Number(req.params.id));
      }
      res.json({ message: 'Updated successfully' });
    } catch (e: any) { handleSqlError(e, res); }
  },
  aprovar: async (req, res) => {
    try {
      await pool.query(
        `UPDATE inscricao SET status_processo = 'Aprovado' WHERE id = ?`,
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
  },
  getIndicadores: async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT 
            p.id_projeto,
            p.nome_projeto,
            p.descricao AS descricao_projeto,
            COUNT(DISTINCT pr.id_programa) AS total_programas_vinculados,
            COUNT(DISTINCT c.id_curso) AS total_cursos_ofertados,
            COUNT(DISTINCT t.id_turma) AS total_turmas_abertas,
            COUNT(DISTINCT mt.id_jovem) AS total_jovens_atendidos,
            COALESCE((SELECT SUM(meta_jovens) FROM programa WHERE id_projeto = p.id_projeto), 0) AS meta_jovens_programas
        FROM projeto p
        LEFT JOIN programa pr ON p.id_projeto = pr.id_projeto
        LEFT JOIN curso c ON pr.id_programa = c.id_programa
        LEFT JOIN turma t ON c.id_curso = t.id_curso
        LEFT JOIN matricula_turma mt ON t.id_turma = mt.id_turma
        WHERE p.id_projeto = ?
        GROUP BY p.id_projeto, p.nome_projeto, p.descricao`,
        [req.params.id]
      );
      if ((rows as any[]).length === 0) {
        res.status(404).json({ message: 'Projeto não encontrado' });
        return;
      }
      const projeto = (rows as any[])[0];

      const [programas]: any = await pool.query(
        `SELECT pr.id_programa, pr.nome_programa, pr.ano, pr.status, pr.meta_jovens,
                COUNT(DISTINCT c.id_curso) AS total_cursos,
                COUNT(DISTINCT t.id_turma) AS total_turmas,
                COUNT(DISTINCT mt.id_jovem) AS total_jovens
         FROM programa pr
         LEFT JOIN curso c ON c.id_programa = pr.id_programa
         LEFT JOIN turma t ON t.id_curso = c.id_curso
         LEFT JOIN matricula_turma mt ON mt.id_turma = t.id_turma
         WHERE pr.id_projeto = ?
         GROUP BY pr.id_programa, pr.nome_programa, pr.ano, pr.status, pr.meta_jovens
         ORDER BY pr.ano DESC, pr.nome_programa`,
        [req.params.id]
      );

      const [cursos]: any = await pool.query(
        `SELECT c.id_curso, c.nome_curso, c.tipo_curso, c.modalidade, c.meta_turmas, c.meta_jovens,
                pr.nome_programa,
                COUNT(DISTINCT d.id_disciplina) AS total_disciplinas,
                COUNT(DISTINCT t.id_turma) AS total_turmas,
                COUNT(DISTINCT mt.id_jovem) AS total_jovens
         FROM curso c
         JOIN programa pr ON pr.id_programa = c.id_programa
         LEFT JOIN disciplina d ON d.id_curso = c.id_curso
         LEFT JOIN turma t ON t.id_curso = c.id_curso
         LEFT JOIN matricula_turma mt ON mt.id_turma = t.id_turma
         WHERE pr.id_projeto = ?
         GROUP BY c.id_curso, c.nome_curso, c.tipo_curso, c.modalidade, c.meta_turmas, c.meta_jovens, pr.nome_programa
         ORDER BY pr.nome_programa, c.nome_curso`,
        [req.params.id]
      );

      const [turmas]: any = await pool.query(
        `SELECT t.id_turma, t.codigo_turma, t.periodo, t.modalidade, t.vagas_total, t.local, t.sala,
                DATE_FORMAT(t.data_inicio, '%Y-%m-%d') AS data_inicio,
                DATE_FORMAT(t.data_fim, '%Y-%m-%d') AS data_fim,
                t.ativo, c.nome_curso, pr.nome_programa, e.nome AS nome_educador,
                COUNT(DISTINCT mt.id_jovem) AS total_jovens
         FROM turma t
         JOIN curso c ON c.id_curso = t.id_curso
         JOIN programa pr ON pr.id_programa = c.id_programa
         LEFT JOIN educador e ON e.id_educador = t.id_educador
         LEFT JOIN matricula_turma mt ON mt.id_turma = t.id_turma
         WHERE pr.id_projeto = ?
         GROUP BY t.id_turma, t.codigo_turma, t.periodo, t.modalidade, t.vagas_total, t.local, t.sala,
                  t.data_inicio, t.data_fim, t.ativo, c.nome_curso, pr.nome_programa, e.nome
         ORDER BY t.data_inicio DESC, t.codigo_turma`,
        [req.params.id]
      );

      const [jovens]: any = await pool.query(
        `SELECT DISTINCT j.id_jovem, j.matricula, j.nome_completo, mt.status_matricula,
                t.codigo_turma, c.nome_curso, pr.nome_programa
         FROM matricula_turma mt
         JOIN cadastro_jovem j ON j.id_jovem = mt.id_jovem
         JOIN turma t ON t.id_turma = mt.id_turma
         JOIN curso c ON c.id_curso = t.id_curso
         JOIN programa pr ON pr.id_programa = c.id_programa
         WHERE pr.id_projeto = ?
         ORDER BY j.nome_completo`,
        [req.params.id]
      );

      res.json({ ...projeto, programas, cursos, turmas, jovens });
    } catch (e: any) { handleSqlError(e, res); }
  }
};

// --- Programas ---
export const ProgramaController: Record<string, RequestHandler> = {
  ...crudController('programa', 'id_programa'),
  getAll: async (_req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT pg.*,
                DATE_FORMAT(pg.data_inicio, '%Y-%m-%d') AS data_inicio,
                DATE_FORMAT(pg.data_fim, '%Y-%m-%d') AS data_fim,
                p.nome_projeto
         FROM programa pg
         JOIN projeto p ON p.id_projeto = pg.id_projeto
         ORDER BY pg.ano DESC, pg.nome_programa`
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
        `SELECT c.*, pg.nome_programa, p.nome_projeto
         FROM curso c
         LEFT JOIN programa pg ON pg.id_programa = c.id_programa
         LEFT JOIN projeto p ON p.id_projeto = pg.id_projeto
         ORDER BY c.nome_curso`
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
        `SELECT d.*, c.nome_curso, pg.nome_programa, p.nome_projeto, e.nome AS nome_educador
         FROM disciplina d
         JOIN curso c ON c.id_curso = d.id_curso
         LEFT JOIN programa pg ON pg.id_programa = c.id_programa
         LEFT JOIN projeto p ON p.id_projeto = pg.id_projeto
         LEFT JOIN educador e ON e.id_educador = d.educador_preferencial
         ORDER BY d.id_curso, d.ordem`
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
        `SELECT t.*,
                DATE_FORMAT(t.data_inicio, '%Y-%m-%d') AS data_inicio,
                DATE_FORMAT(t.data_fim, '%Y-%m-%d') AS data_fim,
                TIME_FORMAT(t.horario_inicio, '%H:%i') AS horario_inicio,
                TIME_FORMAT(t.horario_fim, '%H:%i') AS horario_fim,
                COALESCE(t.vagas_total, t.vagas) AS vagas_total,
                c.nome_curso, pg.nome_programa, p.nome_projeto, e.nome AS nome_educador
         FROM turma t
         JOIN curso c ON c.id_curso = t.id_curso
         LEFT JOIN programa pg ON pg.id_programa = c.id_programa
         LEFT JOIN projeto p ON p.id_projeto = pg.id_projeto
         LEFT JOIN educador e ON e.id_educador = t.id_educador
         ORDER BY t.data_inicio DESC`
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  },
  getDiario: async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT 
            t.codigo_turma,
            c.nome_curso,
            IFNULL(e.nome, 'Educador Não Atribuído') AS nome_educador,
            j.matricula AS matricula_aluno,
            j.nome_completo AS nome_aluno,
            mt.status_matricula AS status_aluno,
            COUNT(f.id) AS total_dias_letivos,
            SUM(CASE WHEN f.presente = 1 THEN 1 ELSE 0 END) AS total_presencas,
            SUM(CASE WHEN f.presente = 0 THEN 1 ELSE 0 END) AS total_faltas
        FROM turma t
        JOIN curso c ON t.id_curso = c.id_curso
        LEFT JOIN educador e ON t.id_educador = e.id_educador
        JOIN matricula_turma mt ON t.id_turma = mt.id_turma
        JOIN cadastro_jovem j ON mt.id_jovem = j.id_jovem
        LEFT JOIN frequencia f ON mt.id_matricula = f.matricula_id
        WHERE t.id_turma = ?
        GROUP BY t.id_turma, c.nome_curso, e.nome, j.matricula, j.nome_completo, mt.status_matricula
        ORDER BY j.nome_completo ASC`,
        [req.params.id]
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
        `SELECT mt.*,
                DATE_FORMAT(mt.data_matricula, '%Y-%m-%d') AS data_matricula,
                j.nome_completo AS nome_jovem, j.matricula AS matricula,
                t.codigo_turma, t.periodo AS periodo_turma, t.ativo AS status_turma,
                DATE_FORMAT(t.data_inicio, '%Y-%m-%d') AS data_inicio_turma,
                DATE_FORMAT(t.data_fim, '%Y-%m-%d') AS data_fim_turma,
                t.modalidade AS modalidade_turma,
                c.nome_curso, pg.nome_programa, p.nome_projeto
         FROM matricula_turma mt
         JOIN cadastro_jovem j ON j.id_jovem = mt.id_jovem
         JOIN turma t ON t.id_turma = mt.id_turma
         JOIN curso c ON c.id_curso = t.id_curso
         JOIN programa pg ON pg.id_programa = c.id_programa
         LEFT JOIN projeto p ON p.id_projeto = pg.id_projeto
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
      const [[inscricoesRow]]: any = await pool.query(`SELECT COUNT(*) AS total FROM inscricao WHERE ano_processo = 2026`);
      const [[turmasRow]]: any = await pool.query(`SELECT COUNT(*) AS total FROM turma WHERE ativo = 'S'`);
      const [[educadoresRow]]: any = await pool.query(`SELECT COUNT(*) AS total FROM educador WHERE ativo = 'S'`);
      const [[empresasRow]]: any = await pool.query(`SELECT COUNT(*) AS total FROM empresa WHERE ativo = 'S'`);
      const [[contratosRow]]: any = await pool.query(`SELECT COUNT(*) AS total FROM contrato_aprendiz WHERE status_contrato = 'Ativo'`);

      const [porStatus]: any = await pool.query(
        `SELECT status_processo, COUNT(*) AS total FROM inscricao WHERE ano_processo = 2026 GROUP BY status_processo`
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
export const FrequenciaController: Record<string, RequestHandler> = {
  ...crudController('frequencia', 'id'),

  // GET /frequencias/turma/:turmaId/alunos  — lista alunos matriculados numa turma
  getAlunosByTurma: async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT mt.id_matricula, j.nome_completo, j.matricula AS matricula_aluno, mt.status_matricula
         FROM matricula_turma mt
         JOIN cadastro_jovem j ON j.id_jovem = mt.id_jovem
         WHERE mt.id_turma = ? AND mt.status_matricula = 'Cursando'
         ORDER BY j.nome_completo ASC`,
        [req.params.turmaId]
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  },

  // GET /frequencias/turma/:turmaId/data/:data — busca frequência lançada para uma turma+data
  getFrequenciaByTurmaData: async (req, res) => {
    try {
      const { turmaId, data } = req.params;
      // Busca aula
      const [aulaRows] = await pool.query(
        `SELECT * FROM aula WHERE id_turma = ? AND data_aula = ?`,
        [turmaId, data]
      ) as any[];
      const aula = (aulaRows as any[])[0] || null;

      // Busca frequencias para os alunos dessa turma nessa data
      const [freqRows] = await pool.query(
        `SELECT f.*, mt.id_matricula, j.nome_completo, j.matricula AS matricula_aluno
         FROM matricula_turma mt
         JOIN cadastro_jovem j ON j.id_jovem = mt.id_jovem
         LEFT JOIN frequencia f ON f.matricula_id = mt.id_matricula AND f.data_aula = ?
         WHERE mt.id_turma = ? AND mt.status_matricula = 'Cursando'
         ORDER BY j.nome_completo ASC`,
        [data, turmaId]
      );
      res.json({ aula, frequencias: freqRows });
    } catch (e: any) { handleSqlError(e, res); }
  },

  // POST /frequencias/lancar — salvar lançamento em lote
  lancar: async (req, res) => {
    try {
      const { id_turma, data_aula, periodo, id_educador, conteudo_ministrado, observacoes_gerais, frequencias } = req.body;

      // 1. Upsert na tabela aula
      const [existingAula] = await pool.query(
        `SELECT id_aula FROM aula WHERE id_turma = ? AND data_aula = ?`,
        [id_turma, data_aula]
      ) as any[];
      
      let id_aula: number;
      if ((existingAula as any[]).length > 0) {
        id_aula = (existingAula as any[])[0].id_aula;
        await pool.query(
          `UPDATE aula SET periodo = ?, id_educador = ?, conteudo_ministrado = ?, observacoes_gerais = ? WHERE id_aula = ?`,
          [periodo || null, id_educador || null, conteudo_ministrado || null, observacoes_gerais || null, id_aula]
        );
      } else {
        const [insertResult]: any = await pool.query(
          `INSERT INTO aula (id_turma, data_aula, periodo, id_educador, conteudo_ministrado, observacoes_gerais) VALUES (?, ?, ?, ?, ?, ?)`,
          [id_turma, data_aula, periodo || null, id_educador || null, conteudo_ministrado || null, observacoes_gerais || null]
        );
        id_aula = insertResult.insertId;
      }

      // 2. Upsert frequências (um por aluno)
      for (const f of frequencias) {
        await pool.query(
          `INSERT INTO frequencia (id_aula, matricula_id, data_aula, presente, justificativa, observacao_individual)
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE presente = VALUES(presente), justificativa = VALUES(justificativa), observacao_individual = VALUES(observacao_individual), id_aula = VALUES(id_aula)`,
          [id_aula, f.matricula_id, data_aula, f.presente ? 1 : 0, f.justificativa || null, f.observacao_individual || null]
        );
      }

      res.json({ message: 'Frequência lançada com sucesso!', id_aula });
    } catch (e: any) { handleSqlError(e, res); }
  },

  // GET /frequencias/turma/:turmaId/resumo — resumo de frequências da turma
  getResumoTurma: async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT 
            j.nome_completo,
            j.matricula AS matricula_aluno,
            COUNT(f.id) AS total_aulas_lancadas,
            SUM(CASE WHEN f.presente = 1 THEN 1 ELSE 0 END) AS total_presencas,
            SUM(CASE WHEN f.presente = 0 THEN 1 ELSE 0 END) AS total_faltas
         FROM matricula_turma mt
         JOIN cadastro_jovem j ON j.id_jovem = mt.id_jovem
         LEFT JOIN frequencia f ON f.matricula_id = mt.id_matricula
         WHERE mt.id_turma = ? AND mt.status_matricula = 'Cursando'
         GROUP BY mt.id_matricula, j.nome_completo, j.matricula
         ORDER BY j.nome_completo ASC`,
        [req.params.turmaId]
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  },

  // GET /frequencias/turma/:turmaId/aulas — lista de aulas lançadas para a turma
  getAulasByTurma: async (req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT a.*, e.nome AS nome_educador,
                (SELECT COUNT(*) FROM frequencia f WHERE f.id_aula = a.id_aula AND f.presente = 1) AS total_presentes,
                (SELECT COUNT(*) FROM frequencia f WHERE f.id_aula = a.id_aula AND f.presente = 0) AS total_ausentes
         FROM aula a
         LEFT JOIN educador e ON e.id_educador = a.id_educador
         WHERE a.id_turma = ?
         ORDER BY a.data_aula DESC`,
        [req.params.turmaId]
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  }
};
export const OcorrenciaController: Record<string, RequestHandler> = {
  ...crudController('ocorrencia', 'id'),
  getAll: async (_req, res) => {
    try {
      const [rows] = await pool.query(
        `SELECT o.*, 
                j.nome_completo AS nome_jovem, 
                j.matricula AS matricula_jovem, 
                e.nome AS nome_educador
         FROM ocorrencia o
         JOIN cadastro_jovem j ON o.jovem_id = j.id_jovem
         LEFT JOIN educador e ON o.educador_id = e.id_educador
         ORDER BY o.criado_em DESC`
      );
      res.json(rows);
    } catch (e: any) { handleSqlError(e, res); }
  },
  create: async (req: any, res: any) => {
    try {
      const username = req.user?.username || req.user?.email || 'sistema';
      const body = {
        ...req.body,
        criado_por: username
      };
      const result: any = await BaseModel.insert('ocorrencia', body);
      res.status(201).json({ id: result.insertId, ...body });
    } catch (e: any) {
      handleSqlError(e, res);
    }
  }
};
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
