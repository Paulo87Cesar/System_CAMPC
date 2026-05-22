import React, { useEffect, useState } from 'react';
import CrudPage from '../components/CrudPage';
import api from '../api';

interface Curso { id_curso: number; nome_curso: string; }
interface Educador { id_educador: number; nome: string; }

interface Disciplina {
  id_disciplina?: number;
  id_curso: string | number;
  nome_disciplina: string;
  descricao?: string;
  tipo_disciplina?: string;
  competencias?: string;
  objetivos?: string;
  metodologia?: string;
  criterio_avaliacao?: string;
  educador_preferencial?: string | number;
  carga_horaria_horas: number;
  carga_horaria_minutos: number;
  ordem: number;
  ativo: string;
  nome_curso?: string;
  nome_programa?: string;
  nome_projeto?: string;
  nome_educador?: string;
}

export default function DisciplinasPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [educadores, setEducadores] = useState<Educador[]>([]);

  useEffect(() => {
    api.get<Curso[]>('/cursos').then(r => setCursos(r.data)).catch(() => {});
    api.get<Educador[]>('/educadores').then(r => setEducadores(r.data)).catch(() => {});
  }, []);

  const defaultForm: Partial<Disciplina> = {
    id_curso: '', nome_disciplina: '', descricao: '', tipo_disciplina: 'Técnica',
    competencias: '', objetivos: '', metodologia: '', criterio_avaliacao: '',
    educador_preferencial: '', carga_horaria_horas: 3, carga_horaria_minutos: 30,
    ordem: 1, ativo: 'S'
  };

  return (
    <CrudPage<Disciplina>
      title="Disciplinas"
      endpoint="/disciplinas"
      idKey="id_disciplina"
      searchKeys={['nome_disciplina', 'nome_curso', 'nome_programa', 'nome_projeto']}
      columns={[
        { label: '#', key: 'ordem', width: '50px' },
        { label: 'Disciplina', key: 'nome_disciplina', render: r => <button className="link-btn">{r.nome_disciplina}</button> },
        { label: 'Projeto', key: 'nome_projeto' },
        { label: 'Programa', key: 'nome_programa' },
        { label: 'Curso', key: 'nome_curso' },
        { label: 'Tipo', key: 'tipo_disciplina', render: r => r.tipo_disciplina || '-' },
        { label: 'Educador Pref.', key: 'nome_educador', render: r => r.nome_educador || '-' },
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
            <label>Tipo de Disciplina</label>
            <select value={data.tipo_disciplina || 'Técnica'} onChange={e => onChange('tipo_disciplina', e.target.value)}>
              <option>Técnica</option><option>Comportamental</option><option>Básica</option>
            </select>
          </div>
          <div className="form-group">
            <label>Educador Preferencial</label>
            <select value={data.educador_preferencial || ''} onChange={e => onChange('educador_preferencial', e.target.value)}>
              <option value="">Selecione</option>
              {educadores.map(e => <option key={e.id_educador} value={e.id_educador}>{e.nome}</option>)}
            </select>
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
          <div className="form-group span-2">
            <label>Competências</label>
            <textarea value={data.competencias || ''} onChange={e => onChange('competencias', e.target.value)} />
          </div>
          <div className="form-group span-2">
            <label>Objetivos</label>
            <textarea value={data.objetivos || ''} onChange={e => onChange('objetivos', e.target.value)} />
          </div>
          <div className="form-group span-2">
            <label>Metodologia</label>
            <textarea value={data.metodologia || ''} onChange={e => onChange('metodologia', e.target.value)} />
          </div>
          <div className="form-group span-2">
            <label>Critério de Avaliação</label>
            <textarea value={data.criterio_avaliacao || ''} onChange={e => onChange('criterio_avaliacao', e.target.value)} />
          </div>
        </div>
      )}
    />
  );
}
