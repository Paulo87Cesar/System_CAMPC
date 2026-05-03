import React, { useEffect, useState } from 'react';
import CrudPage from '../components/CrudPage';
import api from '../api';

interface Programa { id_programa: number; nome_programa: string; }

interface Curso {
  id_curso?: number;
  id_programa: string | number;
  nome_curso: string;
  descricao?: string;
  conteudo?: string;
  carga_horaria_horas: number;
  carga_horaria_minutos: number;
  ativo: string;
  nome_programa?: string;
}

export default function CursosPage() {
  const defaultForm: Partial<Curso> = { nome_curso: '', descricao: '', conteudo: '', carga_horaria_horas: 0, carga_horaria_minutos: 0, ativo: 'S' };
  
  return (
    <CrudPage<Curso>
      title="Cursos"
      endpoint="/cursos"
      idKey="id_curso"
      searchKeys={['nome_curso']}
      columns={[
        { label: 'Curso', key: 'nome_curso', render: r => <button className="link-btn">{r.nome_curso}</button> },
        { label: 'C.H.', key: 'carga_horaria_horas', render: r => `${r.carga_horaria_horas}h${r.carga_horaria_minutos ? r.carga_horaria_minutos + 'min' : ''}` },
        { label: 'Status', key: 'ativo', render: r => (
          <span className={`badge ${r.ativo === 'S' ? 'badge-blue' : 'badge-grey'}`}>{r.ativo === 'S' ? 'Ativo' : 'Inativo'}</span>
        )},
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => (
        <div className="form-grid cols-1">
          <div className="form-group">
            <label>Nome do Curso *</label>
            <input type="text" value={data.nome_curso || ''} onChange={e => onChange('nome_curso', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <textarea value={data.descricao || ''} onChange={e => onChange('descricao', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Conteúdo / Ementa</label>
            <textarea value={data.conteudo || ''} onChange={e => onChange('conteudo', e.target.value)} rows={4} />
          </div>
          <div className="form-grid">
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
