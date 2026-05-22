import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { downloadPDF } from '../api';

interface IndicadorPrograma {
  id_programa: number;
  nome_programa: string;
  ano?: number;
  status?: string;
  meta_jovens?: number;
  total_cursos: number;
  total_turmas: number;
  total_jovens: number;
}

interface IndicadorCurso {
  id_curso: number;
  nome_curso: string;
  nome_programa: string;
  tipo_curso?: string;
  modalidade?: string;
  meta_turmas?: number;
  meta_jovens?: number;
  total_disciplinas: number;
  total_turmas: number;
  total_jovens: number;
}

interface IndicadorTurma {
  id_turma: number;
  codigo_turma: string;
  nome_programa: string;
  nome_curso: string;
  nome_educador?: string;
  periodo?: string;
  modalidade?: string;
  vagas_total?: number;
  local?: string;
  sala?: string;
  data_inicio?: string;
  data_fim?: string;
  ativo?: string;
  total_jovens: number;
}

interface IndicadorJovem {
  id_jovem: number;
  matricula?: string;
  nome_completo: string;
  status_matricula: string;
  codigo_turma: string;
  nome_curso: string;
  nome_programa: string;
}

interface IndicadoresProjeto {
  id_projeto: number;
  nome_projeto: string;
  descricao_projeto: string;
  total_programas_vinculados: number;
  total_cursos_ofertados: number;
  total_turmas_abertas: number;
  total_jovens_atendidos: number;
  meta_jovens_programas?: number;
  programas?: IndicadorPrograma[];
  cursos?: IndicadorCurso[];
  turmas?: IndicadorTurma[];
  jovens?: IndicadorJovem[];
}

function statusBadge(status?: string) {
  const map: Record<string, string> = {
    Ativo: 'badge-blue',
    Planejado: 'badge-yellow',
    Encerrado: 'badge-grey',
    Suspenso: 'badge-red',
    Cursando: 'badge-blue',
    Concluído: 'badge-green',
    Desistente: 'badge-red',
    Reprovado: 'badge-red',
    Transferido: 'badge-grey'
  };
  return <span className={`badge ${map[status || ''] || 'badge-grey'}`}>{status || '-'}</span>;
}

function fmtDate(value?: string) {
  return value ? new Date(value).toLocaleDateString('pt-BR') : '-';
}

export default function ProjetoRelatorioFullscreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<IndicadoresProjeto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/projetos/${id}/indicadores`)
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleClose = () => {
    navigate(`/projetos/${id}/indicadores`);
  };

  const handleDownloadPDF = () => {
    if (!data) return;
    const pdfUrl = `${import.meta.env.VITE_API_URL || '/api'}/pdf/projetos/${id}/indicadores`;
    const filename = `relatorio_indicadores_${data.nome_projeto.replace(/\s+/g, '_')}.pdf`;
    downloadPDF(pdfUrl, filename);
  };

  if (loading) return (
    <div className="fullscreen-modal">
      <div className="modal-content">
        <div className="loading"><div className="spinner" /></div>
      </div>
    </div>
  );

  if (!data) {
    return (
      <div className="fullscreen-modal">
        <div className="modal-content">
          <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <p>Dados não encontrados ou ocorreu um erro.</p>
            <button className="btn-secondary" onClick={handleClose}>Fechar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fullscreen-modal">
      <div className="modal-header">
        <div className="modal-title-section">
          <h2>Relatório de Indicadores - {data.nome_projeto}</h2>
          <button className="btn-ghost" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={handleClose}>Fechar</button>
          <button className="btn btn-primary" onClick={handleDownloadPDF}>Exportar PDF</button>
        </div>
      </div>

      <div className="modal-body">
        <div className="modal-section">
          <div className="card" style={{ padding: 32, marginBottom: 24, background: 'linear-gradient(135deg, var(--blue-brand) 0%, #1a365d 100%)', color: 'white', borderRadius: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '28px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '16px' }}>{data.nome_projeto}</h3>
            <p style={{ margin: '16px 0 0 0', opacity: 0.9, lineHeight: '1.6' }}>{data.descricao_projeto || 'Sem descrição'}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: 24 }}>
            <div className="card" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #f59e0b' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>Programas Vinculados</h4>
              <span style={{ fontSize: '48px', fontWeight: 700, color: '#f59e0b' }}>{data.total_programas_vinculados}</span>
            </div>
            <div className="card" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #10b981' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>Cursos Ofertados</h4>
              <span style={{ fontSize: '48px', fontWeight: 700, color: '#10b981' }}>{data.total_cursos_ofertados}</span>
            </div>
            <div className="card" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #3b82f6' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>Turmas Abertas</h4>
              <span style={{ fontSize: '48px', fontWeight: 700, color: '#3b82f6' }}>{data.total_turmas_abertas}</span>
            </div>
            <div className="card" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #8b5cf6' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>Jovens Únicos</h4>
              <span style={{ fontSize: '48px', fontWeight: 700, color: '#8b5cf6' }}>{data.total_jovens_atendidos}</span>
            </div>
            <div className="card" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #14b8a6' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>Meta de Jovens</h4>
              <span style={{ fontSize: '48px', fontWeight: 700, color: '#14b8a6' }}>{data.meta_jovens_programas || 0}</span>
            </div>
          </div>

          {(data.programas && data.programas.length > 0) && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-header"><span className="card-title">Programas</span></div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Programa</th><th>Ano</th><th>Situação</th><th>Meta</th><th>Cursos</th><th>Turmas</th><th>Jovens</th></tr></thead>
                  <tbody>{data.programas.map(p => (
                    <tr key={p.id_programa}><td>{p.nome_programa}</td><td>{p.ano || '-'}</td><td>{statusBadge(p.status)}</td><td>{p.meta_jovens || '-'}</td><td>{p.total_cursos}</td><td>{p.total_turmas}</td><td>{p.total_jovens}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {(data.cursos && data.cursos.length > 0) && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-header"><span className="card-title">Cursos</span></div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Programa</th><th>Curso</th><th>Tipo</th><th>Modalidade</th><th>Disciplinas</th><th>Turmas</th><th>Jovens</th><th>Metas</th></tr></thead>
                  <tbody>{data.cursos.map(c => (
                    <tr key={c.id_curso}><td>{c.nome_programa}</td><td>{c.nome_curso}</td><td>{c.tipo_curso || '-'}</td><td>{c.modalidade || '-'}</td><td>{c.total_disciplinas}</td><td>{c.total_turmas}</td><td>{c.total_jovens}</td><td>{c.meta_turmas || 0} turmas / {c.meta_jovens || 0} jovens</td></tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {(data.turmas && data.turmas.length > 0) && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-header"><span className="card-title">Turmas</span></div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Programa</th><th>Curso</th><th>Turma</th><th>Educador</th><th>Período</th><th>Vagas</th><th>Início</th><th>Jovens</th><th>Status</th></tr></thead>
                  <tbody>{data.turmas.map(t => (
                    <tr key={t.id_turma}><td>{t.nome_programa}</td><td>{t.nome_curso}</td><td>{t.codigo_turma}</td><td>{t.nome_educador || '-'}</td><td>{t.periodo || '-'}</td><td>{t.vagas_total || '-'}</td><td>{fmtDate(t.data_inicio)}</td><td>{t.total_jovens}</td><td>{t.ativo === 'S' ? statusBadge('Ativo') : statusBadge('Encerrado')}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {(data.jovens && data.jovens.length > 0) && (
            <div className="card">
              <div className="card-header"><span className="card-title">Jovens Vinculados</span></div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Matrícula</th><th>Jovem</th><th>Programa</th><th>Curso</th><th>Turma</th><th>Status Matrícula</th></tr></thead>
                  <tbody>{data.jovens.map(j => (
                    <tr key={`${j.id_jovem}-${j.codigo_turma}`}><td>{j.matricula || '-'}</td><td>{j.nome_completo}</td><td>{j.nome_programa}</td><td>{j.nome_curso}</td><td>{j.codigo_turma}</td><td>{statusBadge(j.status_matricula)}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}