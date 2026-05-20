import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

interface IndicadoresProjeto {
  id_projeto: number;
  nome_projeto: string;
  descricao_projeto: string;
  total_programas_vinculados: number;
  total_cursos_ofertados: number;
  total_turmas_abertas: number;
  total_jovens_atendidos: number;
}

export default function ProjetoIndicadores() {
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

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  if (!data) {
    return (
      <div className="crud-page">
        <div className="crud-header">
          <h2>Indicadores do Projeto</h2>
          <button className="btn-secondary" onClick={() => navigate('/projetos')}>Voltar</button>
        </div>
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <p>Dados não encontrados ou ocorreu um erro.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crud-page">
      <div className="crud-header">
        <h2>Indicadores Executivos</h2>
        <button className="btn-secondary" onClick={() => navigate('/projetos')}>Voltar aos Projetos</button>
      </div>

      <div className="card" style={{ padding: 32, marginBottom: 24, background: 'linear-gradient(135deg, var(--blue-brand) 0%, #1a365d 100%)', color: 'white', borderRadius: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '28px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '16px' }}>{data.nome_projeto}</h3>
        <p style={{ margin: '16px 0 0 0', opacity: 0.9, lineHeight: '1.6' }}>{data.descricao_projeto || 'Sem descrição'}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
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
        
        <div className="card" style={{ padding: '24px', textAlign: 'center', borderTop: '4px solid #8b5cf6', gridColumn: '1 / -1' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', textTransform: 'uppercase' }}>Jovens Únicos Impactados</h4>
          <span style={{ fontSize: '64px', fontWeight: 800, color: '#8b5cf6' }}>{data.total_jovens_atendidos}</span>
        </div>
      </div>
    </div>
  );
}
