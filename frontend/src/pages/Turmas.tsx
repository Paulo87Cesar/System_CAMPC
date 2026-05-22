import React, { useEffect, useState } from 'react';
import CrudPage from '../components/CrudPage';
import api from '../api';

interface Curso { id_curso: number; nome_curso: string; nome_programa?: string; nome_projeto?: string; }
interface Educador { id_educador: number; nome: string; }

interface Turma {
  id_turma?: number;
  id_curso: string | number;
  id_educador?: string | number;
  codigo_turma: string;
  periodo: string;
  data_inicio?: string;
  data_fim?: string;
  vagas?: string | number;
  vagas_total?: string | number;
  local?: string;
  sala?: string;
  modalidade?: string;
  dias_semana?: string;
  horario_inicio?: string;
  horario_fim?: string;
  ativo: string;
  nome_curso?: string;
  nome_programa?: string;
  nome_projeto?: string;
  nome_educador?: string;
}

export default function TurmasPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [educadores, setEducadores] = useState<Educador[]>([]);

  useEffect(() => {
    api.get<Curso[]>('/cursos').then(r => setCursos(r.data)).catch(() => { });
    api.get<Educador[]>('/educadores').then(r => setEducadores(r.data)).catch(() => { });
  }, []);

  const defaultForm: Partial<Turma> = {
    id_curso: '', id_educador: '', codigo_turma: '',
    periodo: 'Matutino', data_inicio: '', data_fim: '',
    vagas: '', vagas_total: '', local: '', sala: '', modalidade: 'Presencial',
    dias_semana: '', horario_inicio: '', horario_fim: '', ativo: 'S'
  };

  return (
    <CrudPage<Turma>
      title="Turmas"
      endpoint="/turmas"
      idKey="id_turma"
      searchKeys={['codigo_turma', 'nome_curso', 'nome_programa', 'nome_projeto', 'nome_educador']}
      columns={[
        { label: 'Código', key: 'codigo_turma', render: r => <button className="link-btn">{r.codigo_turma}</button> },
        { label: 'Projeto', key: 'nome_projeto' },
        { label: 'Programa', key: 'nome_programa' },
        { label: 'Curso', key: 'nome_curso' },
        { label: 'Educador', key: 'nome_educador' },
        { label: 'Período', key: 'periodo' },
        { label: 'Modalidade', key: 'modalidade', render: r => r.modalidade || '-' },
        { label: 'Início', key: 'data_inicio', render: r => r.data_inicio ? new Date(r.data_inicio).toLocaleDateString('pt-BR') : '-' },
        { label: 'Vagas', key: 'vagas_total', render: r => r.vagas_total || r.vagas || '-' },
        {
          label: 'Status', key: 'ativo', render: r => (
            <span className={`badge ${r.ativo === 'S' ? 'badge-green' : 'badge-grey'}`}>{r.ativo === 'S' ? 'Ativa' : 'Encerrada'}</span>
          )
        },
        {
          label: 'Ações',
          key: 'acoes',
          render: r => (
            <button
              className="btn-secondary"
              style={{ padding: '4px 8px', fontSize: '12px' }}
              onClick={(e) => {
                e.stopPropagation();
                window.open(`/turmas/${r.id_turma}/diario`, '_self');
              }}
            >
              Diário
            </button>
          )
        },
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => (
        <div className="form-grid">
          <div className="form-group span-2">
            <label>Código da Turma *</label>
            <input type="text" value={data.codigo_turma || ''} onChange={e => onChange('codigo_turma', e.target.value)} placeholder="Ex: Turma 22/2021" />
          </div>
          <div className="form-group span-2">
            <label>Curso *</label>
            <select value={data.id_curso || ''} onChange={e => onChange('id_curso', e.target.value)}>
              <option value="">Selecione</option>
              {cursos.map(c => (
                <option key={c.id_curso} value={c.id_curso}>
                  {c.nome_projeto ? `${c.nome_projeto} > ` : ''}{c.nome_programa ? `${c.nome_programa} > ` : ''}{c.nome_curso}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group span-2">
            <label>Educador</label>
            <select value={data.id_educador || ''} onChange={e => onChange('id_educador', e.target.value)}>
              <option value="">Selecione</option>
              {educadores.map(e => <option key={e.id_educador} value={e.id_educador}>{e.nome}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Período</label>
            <select value={data.periodo || 'Matutino'} onChange={e => onChange('periodo', e.target.value)}>
              <option>Matutino</option><option>Vespertino</option><option>Noturno</option><option>Integral</option>
            </select>
          </div>
          <div className="form-group">
            <label>Modalidade</label>
            <select value={data.modalidade || 'Presencial'} onChange={e => onChange('modalidade', e.target.value)}>
              <option>Presencial</option><option>Online</option><option>Híbrido</option>
            </select>
          </div>
          <div className="form-group">
            <label>Vagas Totais</label>
            <input type="number" value={data.vagas_total || data.vagas || ''} onChange={e => { onChange('vagas_total', e.target.value); onChange('vagas', e.target.value); }} />
          </div>
          <div className="form-group">
            <label>Dias da Semana</label>
            <input type="text" value={data.dias_semana || ''} onChange={e => onChange('dias_semana', e.target.value)} placeholder="Ex: Seg, Qua e Sex" />
          </div>
          <div className="form-group">
            <label>Horário Início</label>
            <input type="time" value={data.horario_inicio || ''} onChange={e => onChange('horario_inicio', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Horário Fim</label>
            <input type="time" value={data.horario_fim || ''} onChange={e => onChange('horario_fim', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Data Início</label>
            <input type="date" value={data.data_inicio || ''} onChange={e => onChange('data_inicio', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Data Fim</label>
            <input type="date" value={data.data_fim || ''} onChange={e => onChange('data_fim', e.target.value)} />
          </div>
          <div className="form-group span-2">
            <label>Local</label>
            <input type="text" value={data.local || ''} onChange={e => onChange('local', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Sala</label>
            <input type="text" value={data.sala || ''} onChange={e => onChange('sala', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={data.ativo || 'S'} onChange={e => onChange('ativo', e.target.value)}>
              <option value="S">Ativa</option><option value="N">Encerrada</option>
            </select>
          </div>
        </div>
      )}
    />
  );
}
