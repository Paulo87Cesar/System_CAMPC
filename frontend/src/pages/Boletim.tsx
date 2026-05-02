import React, { useEffect, useState } from 'react';
import CrudPage from '../components/CrudPage';
import api from '../api';

interface Matricula { id_matricula: number; nome_jovem: string; codigo_turma: string; }
interface Disciplina { id_disciplina: number; nome_disciplina: string; }

interface Boletim {
  id_nota?: number;
  id_matricula: string | number;
  id_disciplina: string | number;
  periodo_avaliacao?: string;
  nota: string;
  faltas: number;
  presencas: number;
  observacoes?: string;
  nome_disciplina?: string;
}

export default function BoletimPage() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);

  useEffect(() => {
    api.get<Matricula[]>('/matriculas').then(r => setMatriculas(r.data)).catch(() => {});
    api.get<Disciplina[]>('/disciplinas').then(r => setDisciplinas(r.data)).catch(() => {});
  }, []);

  const defaultForm: Partial<Boletim> = {
    id_matricula: '', id_disciplina: '', periodo_avaliacao: '',
    nota: '', faltas: 0, presencas: 0, observacoes: ''
  };

  return (
    <CrudPage<Boletim>
      title="Boletins"
      endpoint="/boletim"
      idKey="id_nota"
      searchKeys={['nome_disciplina']}
      columns={[
        { label: 'Disciplina', key: 'nome_disciplina' },
        { label: 'Período', key: 'periodo_avaliacao' },
        { label: 'Nota', key: 'nota', render: r => {
          const n = parseFloat(r.nota);
          const cls = n >= 7 ? 'badge-green' : n >= 5 ? 'badge-yellow' : 'badge-red';
          return <span className={`badge ${cls}`}>{r.nota ?? '-'}</span>;
        }},
        { label: 'Presenças', key: 'presencas' },
        { label: 'Faltas', key: 'faltas', render: r => (
          <span style={{ color: r.faltas > 3 ? 'var(--red)' : 'inherit', fontWeight: r.faltas > 3 ? 700 : 400 }}>
            {r.faltas}
          </span>
        )},
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => (
        <div className="form-grid">
          <div className="form-group span-2">
            <label>Matrícula *</label>
            <select value={data.id_matricula || ''} onChange={e => onChange('id_matricula', e.target.value)}>
              <option value="">Selecione</option>
              {matriculas.map(m => <option key={m.id_matricula} value={m.id_matricula}>{m.nome_jovem} — {m.codigo_turma}</option>)}
            </select>
          </div>
          <div className="form-group span-2">
            <label>Disciplina *</label>
            <select value={data.id_disciplina || ''} onChange={e => onChange('id_disciplina', e.target.value)}>
              <option value="">Selecione</option>
              {disciplinas.map(d => <option key={d.id_disciplina} value={d.id_disciplina}>{d.nome_disciplina}</option>)}
            </select>
          </div>
          <div className="form-group span-2">
            <label>Período de Avaliação</label>
            <input type="text" value={data.periodo_avaliacao || ''} onChange={e => onChange('periodo_avaliacao', e.target.value)} placeholder="Ex: Bimestre 1, Janeiro/2026" />
          </div>
          <div className="form-group">
            <label>Nota (0 a 10)</label>
            <input type="number" step="0.1" min="0" max="10" value={data.nota || ''} onChange={e => onChange('nota', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Presenças</label>
            <input type="number" min="0" value={data.presencas || 0} onChange={e => onChange('presencas', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Faltas</label>
            <input type="number" min="0" value={data.faltas || 0} onChange={e => onChange('faltas', e.target.value)} />
          </div>
          <div className="form-group span-2">
            <label>Observações</label>
            <textarea value={data.observacoes || ''} onChange={e => onChange('observacoes', e.target.value)} />
          </div>
        </div>
      )}
    />
  );
}
