import React, { useEffect, useState } from 'react';
import CrudPage from '../components/CrudPage';
import api from '../api';

interface Projeto { id_projeto: number; nome_projeto: string; }

interface Programa {
  id_programa?: number;
  id_projeto: string | number;
  nome_programa: string;
  descricao?: string;
  ano: number;
  data_inicio?: string;
  data_fim?: string;
  publico_alvo?: string;
  meta_jovens?: number;
  responsavel?: string;
  status?: string;
  ativo: string;
  nome_projeto?: string;
}

export default function ProgramasPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  useEffect(() => { api.get<Projeto[]>('/projetos').then(r => setProjetos(r.data)).catch(() => {}); }, []);

  const defaultForm: Partial<Programa> = {
    id_projeto: '', nome_programa: '', descricao: '', ano: new Date().getFullYear(),
    data_inicio: '', data_fim: '', publico_alvo: '', meta_jovens: 0, responsavel: '',
    status: 'Planejado', ativo: 'S'
  };

  return (
    <CrudPage<Programa>
      title="Programas"
      endpoint="/programas"
      idKey="id_programa"
      searchKeys={['nome_programa', 'nome_projeto']}
      columns={[
        { label: 'Programa', key: 'nome_programa', render: r => <button className="link-btn">{r.nome_programa}</button> },
        { label: 'Projeto', key: 'nome_projeto' },
        { label: 'Ano', key: 'ano' },
        { label: 'Meta Jovens', key: 'meta_jovens', render: r => r.meta_jovens || '-' },
        { label: 'Responsável', key: 'responsavel', render: r => r.responsavel || '-' },
        { label: 'Situação', key: 'status', render: r => (
          <span className={`badge ${r.status === 'Ativo' ? 'badge-blue' : r.status === 'Encerrado' ? 'badge-grey' : r.status === 'Suspenso' ? 'badge-red' : 'badge-yellow'}`}>
            {r.status || 'Planejado'}
          </span>
        )},
        { label: 'Status', key: 'ativo', render: r => (
          <span className={`badge ${r.ativo === 'S' ? 'badge-blue' : 'badge-grey'}`}>{r.ativo === 'S' ? 'Ativo' : 'Inativo'}</span>
        )},
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => (
        <div className="form-grid cols-1">
          <div className="form-group">
            <label>Projeto *</label>
            <select value={data.id_projeto || ''} onChange={e => onChange('id_projeto', e.target.value)}>
              <option value="">Selecione o Projeto</option>
              {projetos.map(p => <option key={p.id_projeto} value={p.id_projeto}>{p.nome_projeto}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Nome do Programa *</label>
            <input type="text" value={data.nome_programa || ''} onChange={e => onChange('nome_programa', e.target.value)} placeholder="Ex: OFGMT 2026" />
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <textarea value={data.descricao || ''} onChange={e => onChange('descricao', e.target.value)} />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Ano</label>
              <input type="number" value={data.ano || ''} onChange={e => onChange('ano', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Situação</label>
              <select value={data.status || 'Planejado'} onChange={e => onChange('status', e.target.value)}>
                <option>Planejado</option><option>Ativo</option><option>Encerrado</option><option>Suspenso</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={data.ativo || 'S'} onChange={e => onChange('ativo', e.target.value)}>
                <option value="S">Ativo</option><option value="N">Inativo</option>
              </select>
            </div>
            <div className="form-group">
              <label>Data Início</label>
              <input type="date" value={data.data_inicio || ''} onChange={e => onChange('data_inicio', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Data Fim</label>
              <input type="date" value={data.data_fim || ''} onChange={e => onChange('data_fim', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Meta de Jovens</label>
              <input type="number" min="0" value={data.meta_jovens || 0} onChange={e => onChange('meta_jovens', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Responsável</label>
              <input type="text" value={data.responsavel || ''} onChange={e => onChange('responsavel', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Público-alvo</label>
            <input type="text" value={data.publico_alvo || ''} onChange={e => onChange('publico_alvo', e.target.value)} />
          </div>
        </div>
      )}
    />
  );
}
