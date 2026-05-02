import React, { useEffect, useState } from 'react';
import CrudPage from '../components/CrudPage';
import api from '../api';

interface Curso { id_curso: number; nome_curso: string; }

interface Disciplina {
  id_disciplina?: number;
  id_curso: string | number;
  nome_disciplina: string;
  descricao?: string;
  carga_horaria_horas: number;
  carga_horaria_minutos: number;
  ordem: number;
  ativo: string;
  nome_curso?: string;
}

export default function DisciplinasPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  useEffect(() => { api.get<Curso[]>('/cursos').then(r => setCursos(r.data)).catch(() => {}); }, []);

  const defaultForm: Partial<Disciplina> = { id_curso: '', nome_disciplina: '', descricao: '', carga_horaria_horas: 3, carga_horaria_minutos: 30, ordem: 1, ativo: 'S' };

  return (
    <CrudPage<Disciplina>
      title="Disciplinas"
      endpoint="/disciplinas"
      idKey="id_disciplina"
      searchKeys={['nome_disciplina', 'nome_curso']}
      columns={[
        { label: '#', key: 'ordem', width: '50px' },
        { label: 'Disciplina', key: 'nome_disciplina', render: r => <button className="link-btn">{r.nome_disciplina}</button> },
        { label: 'Curso', key: 'nome_curso' },
        { label: 'C.H.', key: 'carga_horaria_horas', render: r => `${r.carga_horaria_horas}h${r.carga_horaria_minutos ? r.carga_horaria_minutos + 'min' : ''}` },
        { label: 'Status', key: 'ativo', render: r => (
          <span className={`badge ${r.ativo === 'S' ? 'badge-blue' : 'badge-grey'}`}>{r.ativo === 'S' ? 'Ativa' : 'Inativa'}</span>
        )},
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => (
        <div className="form-grid">
          <div className="form-group span-2">
            <label>Curso *</label>
            <select value={data.id_curso || ''} onChange={e => onChange('id_curso', e.target.value)}>
              <option value="">Selecione o Curso</option>
              {cursos.map(c => <option key={c.id_curso} value={c.id_curso}>{c.nome_curso}</option>)}
            </select>
          </div>
          <div className="form-group span-2">
            <label>Nome da Disciplina *</label>
            <input type="text" value={data.nome_disciplina || ''} onChange={e => onChange('nome_disciplina', e.target.value)} />
          </div>
          <div className="form-group span-2">
            <label>Descrição</label>
            <textarea value={data.descricao || ''} onChange={e => onChange('descricao', e.target.value)} />
          </div>
          <div className="form-group">
            <label>C.H. Horas</label>
            <input type="number" value={data.carga_horaria_horas || 0} onChange={e => onChange('carga_horaria_horas', e.target.value)} />
          </div>
          <div className="form-group">
            <label>C.H. Minutos</label>
            <select value={data.carga_horaria_minutos || 0} onChange={e => onChange('carga_horaria_minutos', e.target.value)}>
              <option value={0}>0</option><option value={30}>30</option>
            </select>
          </div>
          <div className="form-group">
            <label>Ordem (Encontro)</label>
            <input type="number" value={data.ordem || 1} onChange={e => onChange('ordem', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={data.ativo || 'S'} onChange={e => onChange('ativo', e.target.value)}>
              <option value="S">Ativa</option><option value="N">Inativa</option>
            </select>
          </div>
        </div>
      )}
    />
  );
}
