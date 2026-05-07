import { RequestHandler } from 'express';
import PDFDocument from 'pdfkit';
import pool from '../config/database';

export const PdfController: Record<string, RequestHandler> = {
  gerarReciboPagamento: async (req, res) => {
    try {
      const { id } = req.params;
      const [rows]: any = await pool.query(
        `SELECT f.*, c.cargo, j.nome_completo, j.cpf, e.nome_fantasia 
         FROM folha_pagamento f
         JOIN contrato_aprendiz c ON c.id_contrato = f.contrato_id
         JOIN cadastro_jovem j ON j.id_jovem = c.id_jovem
         JOIN empresa e ON e.id_empresa = c.id_empresa
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
