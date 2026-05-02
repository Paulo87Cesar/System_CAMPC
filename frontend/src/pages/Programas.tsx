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
  ativo: string;
  nome_projeto?: string;
}

export default function ProgramasPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  useEffect(() => { api.get<Projeto[]>('/projetos').then(r => setProjetos(r.data)).catch(() => {}); }, []);

  const defaultForm: Partial<Programa> = { id_projeto: '', nome_programa: '', descricao: '', ano: new Date().getFullYear(), ativo: 'S' };

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
              <label>Status</label>
              <select value={data.ativo || 'S'} onChange={e => onChange('ativo', e.target.value)}>
                <option value="S">Ativo</option><option value="N">Inativo</option>
              </select>
            </div>
          </div>
        </div>
      )}
    />
  );
}
