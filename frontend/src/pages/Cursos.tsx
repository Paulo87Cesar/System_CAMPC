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
  tipo_curso?: string;
  modalidade?: string;
  idade_minima?: number;
  idade_maxima?: number;
  pre_requisitos?: string;
  certificacao?: string;
  meta_turmas?: number;
  meta_jovens?: number;
  carga_horaria_horas: number;
  carga_horaria_minutos: number;
  ativo: string;
  nome_programa?: string;
  nome_projeto?: string;
}

export default function CursosPage() {
  const [programas, setProgramas] = useState<Programa[]>([]);

  useEffect(() => {
    api.get<Programa[]>('/programas').then(r => setProgramas(r.data)).catch(() => {});
  }, []);

  const defaultForm: Partial<Curso> = {
    id_programa: '', nome_curso: '', descricao: '', conteudo: '',
    tipo_curso: 'Capacitação', modalidade: 'Presencial', idade_minima: 0, idade_maxima: 0,
    pre_requisitos: '', certificacao: '', meta_turmas: 0, meta_jovens: 0,
    carga_horaria_horas: 0, carga_horaria_minutos: 0, ativo: 'S'
  };
  
  return (
    <CrudPage<Curso>
      title="Cursos"
      endpoint="/cursos"
      idKey="id_curso"
      searchKeys={['nome_curso', 'nome_programa']}
      columns={[
        { label: 'Curso', key: 'nome_curso', render: r => <button className="link-btn">{r.nome_curso}</button> },
        { label: 'Projeto', key: 'nome_projeto' },
        { label: 'Programa', key: 'nome_programa', render: r => r.nome_programa ? <span className="badge badge-blue">{r.nome_programa}</span> : '-' },
        { label: 'Tipo', key: 'tipo_curso', render: r => r.tipo_curso || '-' },
        { label: 'Modalidade', key: 'modalidade', render: r => r.modalidade || '-' },
        { label: 'C.H.', key: 'carga_horaria_horas', render: r => `${r.carga_horaria_horas}h${r.carga_horaria_minutos ? r.carga_horaria_minutos + 'min' : ''}` },
        { label: 'Metas', key: 'meta_turmas', render: r => `${r.meta_turmas || 0} turmas / ${r.meta_jovens || 0} jovens` },
        { label: 'Status', key: 'ativo', render: r => (
          <span className={`badge ${r.ativo === 'S' ? 'badge-blue' : 'badge-grey'}`}>{r.ativo === 'S' ? 'Ativo' : 'Inativo'}</span>
        )},
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => (
        <div className="form-grid cols-1">
          <div className="form-group">
            <label>Programa *</label>
            <select value={data.id_programa || ''} onChange={e => onChange('id_programa', e.target.value)} required>
              <option value="">Selecione o Programa</option>
              {programas.map(p => (
                <option key={p.id_programa} value={p.id_programa}>{p.nome_programa}</option>
              ))}
            </select>
            {programas.length === 0 && (
              <small style={{ color: 'var(--red)' }}>⚠ Nenhum programa cadastrado. Cadastre um Programa antes de criar um Curso.</small>
            )}
          </div>
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
              <label>Tipo de Curso</label>
              <select value={data.tipo_curso || 'Capacitação'} onChange={e => onChange('tipo_curso', e.target.value)}>
                <option>Capacitação</option><option>Aprendizagem</option><option>Trilha</option><option>Oficina</option>
              </select>
            </div>
            <div className="form-group">
              <label>Modalidade</label>
              <select value={data.modalidade || 'Presencial'} onChange={e => onChange('modalidade', e.target.value)}>
                <option>Presencial</option><option>Online</option><option>Híbrido</option>
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
              <label>Status</label>
              <select value={data.ativo || 'S'} onChange={e => onChange('ativo', e.target.value)}>
                <option value="S">Ativo</option><option value="N">Inativo</option>
              </select>
            </div>
            <div className="form-group">
              <label>Idade Mínima</label>
              <input type="number" min="0" value={data.idade_minima || 0} onChange={e => onChange('idade_minima', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Idade Máxima</label>
              <input type="number" min="0" value={data.idade_maxima || 0} onChange={e => onChange('idade_maxima', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Meta de Turmas</label>
              <input type="number" min="0" value={data.meta_turmas || 0} onChange={e => onChange('meta_turmas', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Meta de Jovens</label>
              <input type="number" min="0" value={data.meta_jovens || 0} onChange={e => onChange('meta_jovens', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Pré-requisitos</label>
            <textarea value={data.pre_requisitos || ''} onChange={e => onChange('pre_requisitos', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Certificação</label>
            <input type="text" value={data.certificacao || ''} onChange={e => onChange('certificacao', e.target.value)} />
          </div>
        </div>
      )}
    />
  );
}
