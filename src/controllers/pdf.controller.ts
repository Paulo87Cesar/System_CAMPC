import { RequestHandler } from 'express';
import PDFDocument from 'pdfkit';
import pool from '../config/database';

export const PdfController: Record<string, RequestHandler> = {
  gerarRelatorioProjeto: async (req, res) => {
    try {
      const { id } = req.params;
      const [[projeto]]: any = await pool.query(
        `SELECT p.id_projeto, p.nome_projeto, p.descricao,
                COUNT(DISTINCT pr.id_programa) AS programas,
                COUNT(DISTINCT c.id_curso) AS cursos,
                COUNT(DISTINCT t.id_turma) AS turmas,
                COUNT(DISTINCT mt.id_jovem) AS jovens,
                COALESCE((SELECT SUM(meta_jovens) FROM programa WHERE id_projeto = p.id_projeto), 0) AS meta_jovens
         FROM projeto p
         LEFT JOIN programa pr ON pr.id_projeto = p.id_projeto
         LEFT JOIN curso c ON c.id_programa = pr.id_programa
         LEFT JOIN turma t ON t.id_curso = c.id_curso
         LEFT JOIN matricula_turma mt ON mt.id_turma = t.id_turma
         WHERE p.id_projeto = ?
         GROUP BY p.id_projeto, p.nome_projeto, p.descricao`,
        [id]
      );

      if (!projeto) {
        res.status(404).json({ message: 'Projeto não encontrado' });
        return;
      }

      const [programas]: any = await pool.query(
        `SELECT pr.nome_programa, pr.ano, pr.status, pr.meta_jovens,
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
        [id]
      );

      const [cursos]: any = await pool.query(
        `SELECT pr.nome_programa, c.nome_curso, c.tipo_curso, c.modalidade,
                COUNT(DISTINCT d.id_disciplina) AS total_disciplinas,
                COUNT(DISTINCT t.id_turma) AS total_turmas,
                COUNT(DISTINCT mt.id_jovem) AS total_jovens
         FROM curso c
         JOIN programa pr ON pr.id_programa = c.id_programa
         LEFT JOIN disciplina d ON d.id_curso = c.id_curso
         LEFT JOIN turma t ON t.id_curso = c.id_curso
         LEFT JOIN matricula_turma mt ON mt.id_turma = t.id_turma
         WHERE pr.id_projeto = ?
         GROUP BY c.id_curso, pr.nome_programa, c.nome_curso, c.tipo_curso, c.modalidade
         ORDER BY pr.nome_programa, c.nome_curso`,
        [id]
      );

      const [turmas]: any = await pool.query(
        `SELECT pr.nome_programa, c.nome_curso, t.codigo_turma, e.nome AS nome_educador,
                t.periodo, t.modalidade, COALESCE(t.vagas_total, t.vagas) AS vagas_total,
                DATE_FORMAT(t.data_inicio, '%d/%m/%Y') AS data_inicio,
                COUNT(DISTINCT mt.id_jovem) AS total_jovens
         FROM turma t
         JOIN curso c ON c.id_curso = t.id_curso
         JOIN programa pr ON pr.id_programa = c.id_programa
         LEFT JOIN educador e ON e.id_educador = t.id_educador
         LEFT JOIN matricula_turma mt ON mt.id_turma = t.id_turma
         WHERE pr.id_projeto = ?
         GROUP BY t.id_turma, pr.nome_programa, c.nome_curso, t.codigo_turma, e.nome, t.periodo, t.modalidade, t.vagas_total, t.vagas, t.data_inicio
         ORDER BY t.data_inicio DESC, t.codigo_turma`,
        [id]
      );

      const doc = new PDFDocument({ margin: 36, size: 'A4', layout: 'landscape' });
      const fileName = `relatorio_indicadores_${String(projeto.nome_projeto).replace(/\s+/g, '_')}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
      doc.pipe(res);

      const addTitle = (title: string) => {
        doc.moveDown(0.7);
        doc.font('Helvetica-Bold').fontSize(13).text(title);
        doc.moveDown(0.3);
      };

      const row = (cols: string[], widths: number[]) => {
        const y = doc.y;
        cols.forEach((c, i) => doc.font('Helvetica').fontSize(8).text(String(c ?? '-'), 36 + widths.slice(0, i).reduce((a, b) => a + b, 0), y, { width: widths[i] - 6 }));
        doc.moveDown(1.2);
      };

      doc.font('Helvetica-Bold').fontSize(18).text('Relatório de Indicadores Executivos', { align: 'center' });
      doc.moveDown(0.6);
      doc.fontSize(14).text(projeto.nome_projeto);
      doc.font('Helvetica').fontSize(9).text(projeto.descricao || 'Sem descrição');
      doc.moveDown();
      row([
        `Programas: ${projeto.programas}`,
        `Cursos: ${projeto.cursos}`,
        `Turmas: ${projeto.turmas}`,
        `Jovens únicos: ${projeto.jovens}`,
        `Meta de jovens: ${projeto.meta_jovens || 0}`
      ], [140, 120, 120, 140, 140]);

      addTitle('Programas');
      doc.font('Helvetica-Bold'); row(['Programa', 'Ano', 'Situação', 'Meta', 'Cursos', 'Turmas', 'Jovens'], [220, 60, 90, 70, 70, 70, 70]);
      programas.forEach((p: any) => row([p.nome_programa, p.ano, p.status, p.meta_jovens || '-', p.total_cursos, p.total_turmas, p.total_jovens], [220, 60, 90, 70, 70, 70, 70]));

      addTitle('Cursos');
      doc.font('Helvetica-Bold'); row(['Programa', 'Curso', 'Tipo', 'Modalidade', 'Disciplinas', 'Turmas', 'Jovens'], [160, 190, 100, 90, 80, 70, 70]);
      cursos.forEach((c: any) => row([c.nome_programa, c.nome_curso, c.tipo_curso, c.modalidade, c.total_disciplinas, c.total_turmas, c.total_jovens], [160, 190, 100, 90, 80, 70, 70]));

      addTitle('Turmas');
      doc.font('Helvetica-Bold'); row(['Programa', 'Curso', 'Turma', 'Educador', 'Período', 'Vagas', 'Início', 'Jovens'], [130, 160, 90, 150, 70, 55, 75, 55]);
      turmas.forEach((t: any) => row([t.nome_programa, t.nome_curso, t.codigo_turma, t.nome_educador || '-', t.periodo, t.vagas_total || '-', t.data_inicio || '-', t.total_jovens], [130, 160, 90, 150, 70, 55, 75, 55]));

      doc.end();
    } catch (error) {
      console.error(error);
      if (!res.headersSent) res.status(500).json({ message: 'Erro ao gerar relatório PDF' });
    }
  },

  gerarReciboPagamento: async (req, res) => {
    try {
      const { id } = req.params;
      const [rows]: any = await pool.query(
        `SELECT f.*, 
                COALESCE(ca.cargo, 'Estagiário') AS cargo, 
                j.nome_completo, j.cpf, 
                COALESCE(e1.nome_fantasia, e2.nome_fantasia) AS nome_fantasia
         FROM folha_pagamento f
         LEFT JOIN contrato_aprendiz ca ON ca.id_contrato = f.contrato_aprendiz_id
         LEFT JOIN contrato_estagio ce ON ce.id = f.contrato_estagio_id
         JOIN cadastro_jovem j ON j.id_jovem = COALESCE(ca.id_jovem, ce.jovem_id)
         LEFT JOIN empresa e1 ON e1.id_empresa = ca.id_empresa
         LEFT JOIN empresa e2 ON e2.id_empresa = ce.empresa_id
         WHERE f.id = ?`,
        [id]
      );

      if (rows.length === 0) {
        res.status(404).json({ message: 'Folha não encontrada' });
        return;
      }

      const folha = rows[0];

      const doc = new PDFDocument({ margin: 50 });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=recibo_${folha.competencia}_${folha.nome_completo.replace(/\s+/g, '_')}.pdf`);

      doc.pipe(res);

      // Cabecalho
      doc.fontSize(20).text('Recibo de Pagamento - Aprendiz / Estagiário', { align: 'center' });
      doc.moveDown();

      // Empresa
      doc.fontSize(12).font('Helvetica-Bold').text(`Empresa: ${folha.nome_fantasia}`);
      doc.font('Helvetica').text(`Competência: ${folha.competencia}`);
      doc.moveDown();

      // Funcionario
      doc.font('Helvetica-Bold').text(`Nome: ${folha.nome_completo}`);
      doc.font('Helvetica').text(`CPF: ${folha.cpf}`);
      doc.text(`Cargo: ${folha.cargo || 'Aprendiz'}`);
      doc.moveDown();

      // Valores
      doc.rect(50, doc.y, 500, 100).stroke();
      doc.moveDown(0.5);
      
      const yValores = doc.y;
      doc.text(`Vencimentos (Bruto):`, 60, yValores);
      doc.text(`R$ ${Number(folha.valor_bruto).toFixed(2)}`, 400, yValores, { align: 'right', width: 140 });
      
      doc.text(`Descontos:`, 60, yValores + 20);
      doc.text(`R$ ${Number(folha.descontos).toFixed(2)}`, 400, yValores + 20, { align: 'right', width: 140 });
      
      doc.font('Helvetica-Bold');
      doc.text(`Valor Líquido a Receber:`, 60, yValores + 50);
      doc.text(`R$ ${Number(folha.valor_liquido).toFixed(2)}`, 400, yValores + 50, { align: 'right', width: 140 });

      doc.moveDown(4);

      // Assinatura
      const yAssinatura = doc.y + 50;
      doc.moveTo(150, yAssinatura).lineTo(450, yAssinatura).stroke();
      doc.text(`Assinatura do Recebedor`, 150, yAssinatura + 10, { align: 'center', width: 300 });

      doc.end();

    } catch (error) {
      console.error(error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Erro ao gerar PDF' });
      }
    }
  }
};
