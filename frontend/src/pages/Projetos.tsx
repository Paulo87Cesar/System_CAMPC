import React from 'react';
import CrudPage from '../components/CrudPage';

const defaultForm = { nome_projeto: '', descricao: '', data_inicio: '', data_fim: '', ativo: 'S' };

export default function ProjetosPage() {
  return (
    <CrudPage
      title="Projetos"
      endpoint="/projetos"
      idKey="id_projeto"
      searchKeys={['nome_projeto', 'descricao']}
      columns={[
        { label: 'Nome', key: 'nome_projeto', render: r => <button className="link-btn">{r.nome_projeto}</button> },
        { label: 'Descrição', key: 'descricao', render: r => <span style={{ maxWidth: 300, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.descricao || '-'}</span> },
        { label: 'Início', key: 'data_inicio', render: r => r.data_inicio ? new Date(r.data_inicio).toLocaleDateString('pt-BR') : '-' },
        { label: 'Status', key: 'ativo', render: r => (
          <span className={`badge ${r.ativo === 'S' ? 'badge-green' : 'badge-grey'}`}>
            {r.ativo === 'S' ? 'Ativo' : 'Encerrado'}
          </span>
        )},
        { 
          label: 'Ações', 
          key: 'acoes', 
          render: r => (
            <button 
              className="btn-secondary" 
              style={{ padding: '4px 8px', fontSize: '12px' }} 
              onClick={(e) => { 
                e.stopPropagation(); 
                window.open(`/projetos/${r.id_projeto}/indicadores`, '_self'); 
              }}
            >
              📊 Indicadores
            </button>
          ) 
        },
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => (
        <div className="form-grid cols-1">
          <div className="form-group">
            <label>Nome do Projeto *</label>
            <input type="text" value={data.nome_projeto || ''} onChange={e => onChange('nome_projeto', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <textarea value={data.descricao || ''} onChange={e => onChange('descricao', e.target.value)} />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Data Início</label>
              <input type="date" value={data.data_inicio || ''} onChange={e => onChange('data_inicio', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Data Fim</label>
              <input type="date" value={data.data_fim || ''} onChange={e => onChange('data_fim', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={data.ativo || 'S'} onChange={e => onChange('ativo', e.target.value)}>
                <option value="S">Ativo</option><option value="N">Encerrado</option>
              </select>
            </div>
          </div>
        </div>
      )}
    />
  );
}
