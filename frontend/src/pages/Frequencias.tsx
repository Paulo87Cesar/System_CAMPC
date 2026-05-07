import React from 'react';
import CrudPage from '../components/CrudPage';

const defaultForm = {
  matricula_id: '', data_aula: '', presente: true, justificativa: ''
};

export default function FrequenciasPage() {
  return (
    <CrudPage
      title="Frequência"
      endpoint="/frequencias"
      idKey="id"
      searchKeys={['data_aula']}
      columns={[
        { label: 'Matrícula ID', key: 'matricula_id' },
        { label: 'Data da Aula', key: 'data_aula', render: r => new Date(r.data_aula).toLocaleDateString('pt-BR') },
        { label: 'Presente', key: 'presente', render: r => r.presente ? 'Sim' : 'Não' },
        { label: 'Justificativa', key: 'justificativa' }
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => (
        <>
          <div className="form-grid">
            <div className="form-group">
              <label>ID da Matrícula *</label>
              <input type="number" value={data.matricula_id || ''} onChange={e => onChange('matricula_id', Number(e.target.value))} required />
            </div>
            <div className="form-group">
              <label>Data da Aula *</label>
              <input type="date" value={data.data_aula ? data.data_aula.split('T')[0] : ''} onChange={e => onChange('data_aula', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Presente?</label>
              <select value={data.presente ? 'true' : 'false'} onChange={e => onChange('presente', e.target.value === 'true')}>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
            <div className="form-group span-2">
              <label>Justificativa (em caso de falta)</label>
              <input type="text" value={data.justificativa || ''} onChange={e => onChange('justificativa', e.target.value)} />
            </div>
          </div>
        </>
      )}
    />
  );
}
