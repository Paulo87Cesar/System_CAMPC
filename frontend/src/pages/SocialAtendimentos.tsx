import React from 'react';
import CrudPage from '../components/CrudPage';

const defaultForm = {
  jovem_id: '', profissional_id: '', data: '', tipo: 'individual', descricao: '', encaminhamentos: ''
};

export default function SocialAtendimentosPage() {
  return (
    <CrudPage
      title="Atendimentos Sociais"
      endpoint="/atendimento_social"
      idKey="id"
      searchKeys={['tipo', 'descricao', 'encaminhamentos']}
      columns={[
        { label: 'Jovem ID', key: 'jovem_id' },
        { label: 'Profissional ID', key: 'profissional_id' },
        { label: 'Tipo', key: 'tipo' },
        { label: 'Data', key: 'data', render: r => new Date(r.data).toLocaleDateString('pt-BR') }
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => (
        <>
          <div className="form-grid">
            <div className="form-group">
              <label>ID do Jovem *</label>
              <input type="number" value={data.jovem_id || ''} onChange={e => onChange('jovem_id', Number(e.target.value))} required />
            </div>
            <div className="form-group">
              <label>ID do Profissional</label>
              <input type="number" value={data.profissional_id || ''} onChange={e => onChange('profissional_id', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Data *</label>
              <input type="date" value={data.data ? data.data.split('T')[0] : ''} onChange={e => onChange('data', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Tipo</label>
              <select value={data.tipo || 'individual'} onChange={e => onChange('tipo', e.target.value)}>
                <option value="individual">Individual</option>
                <option value="grupo">Grupo</option>
              </select>
            </div>
            <div className="form-group span-2">
              <label>Descrição *</label>
              <textarea value={data.descricao || ''} onChange={e => onChange('descricao', e.target.value)} required />
            </div>
            <div className="form-group span-2">
              <label>Encaminhamentos</label>
              <input type="text" value={data.encaminhamentos || ''} onChange={e => onChange('encaminhamentos', e.target.value)} />
            </div>
          </div>
        </>
      )}
    />
  );
}
