import React, { useEffect, useState } from 'react';
import CrudPage from '../components/CrudPage';
import api from '../api';

interface Jovem { id_jovem: number; nome_completo: string; }
interface Turma { id_turma: number; codigo_turma: string; }

interface Matricula {
  id_matricula?: number;
  id_jovem: string | number;
  id_turma: string | number;
  data_matricula: string;
  status_matricula: string;
  observacoes?: string;
  nome_jovem?: string;
  codigo_turma?: string;
}

export default function MatriculasPage() {
  const [jovens, setJovens] = useState<Jovem[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);

  useEffect(() => {
    api.get<Jovem[]>('/jovens').then(r => setJovens(r.data)).catch(() => {});
    api.get<Turma[]>('/turmas').then(r => setTurmas(r.data)).catch(() => {});
  }, []);

  const defaultForm: Partial<Matricula> = {
    id_jovem: '', id_turma: '',
    data_matricula: new Date().toISOString().split('T')[0],
    status_matricula: 'Cursando', observacoes: ''
  };

  function statusBadge(s: string) {
    const map: Record<string, string> = {
      Cursando: 'badge-blue', Concluído: 'badge-green',
      Desistente: 'badge-red', Reprovado: 'badge-red', Transferido: 'badge-grey'
    };
    return <span className={`badge ${map[s] || 'badge-grey'}`}>{s}</span>;
  }

  return (
    <CrudPage<Matricula>
      title="Matrículas"
      endpoint="/matriculas"
      idKey="id_matricula"
      searchKeys={['nome_jovem', 'codigo_turma']}
      columns={[
        { label: 'Jovem', key: 'nome_jovem', render: r => <button className="link-btn">{r.nome_jovem}</button> },
        { label: 'Turma', key: 'codigo_turma' },
        { label: 'Data Matrícula', key: 'data_matricula', render: r => r.data_matricula ? new Date(r.data_matricula).toLocaleDateString('pt-BR') : '-' },
        { label: 'Status', key: 'status_matricula', render: r => statusBadge(r.status_matricula) },
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => (
        <div className="form-grid cols-1">
          <div className="form-group">
            <label>Jovem *</label>
            <select value={data.id_jovem || ''} onChange={e => onChange('id_jovem', e.target.value)}>
              <option value="">Selecione o Jovem</option>
              {jovens.map(j => <option key={j.id_jovem} value={j.id_jovem}>{j.nome_completo}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Turma *</label>
            <select value={data.id_turma || ''} onChange={e => onChange('id_turma', e.target.value)}>
              <option value="">Selecione a Turma</option>
              {turmas.map(t => <option key={t.id_turma} value={t.id_turma}>{t.codigo_turma}</option>)}
            </select>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Data de Matrícula</label>
              <input type="date" value={data.data_matricula || ''} onChange={e => onChange('data_matricula', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={data.status_matricula || 'Cursando'} onChange={e => onChange('status_matricula', e.target.value)}>
                <option>Cursando</option><option>Concluído</option>
                <option>Desistente</option><option>Reprovado</option><option>Transferido</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Observações</label>
            <textarea value={data.observacoes || ''} onChange={e => onChange('observacoes', e.target.value)} />
          </div>
        </div>
      )}
    />
  );
}
