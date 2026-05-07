import React from 'react';
import CrudPage from '../components/CrudPage';

const defaultForm = {
  jovem_id: '', tipo: 'comportamental', gravidade: 'leve', descricao: '', data_ocorrencia: '', educador_id: ''
};

export default function OcorrenciasPage() {
  return (
    <CrudPage
      title="Ocorrências"
      endpoint="/ocorrencias"
      idKey="id"
      searchKeys={['tipo', 'gravidade', 'descricao']}
      columns={[
        { label: 'Jovem ID', key: 'jovem_id' },
        { label: 'Tipo', key: 'tipo' },
        { label: 'Gravidade', key: 'gravidade' },
        { label: 'Data', key: 'data_ocorrencia', render: r => new Date(r.data_ocorrencia).toLocaleDateString('pt-BR') },
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
              <label>Data *</label>
              <input type="date" value={data.data_ocorrencia ? data.data_ocorrencia.split('T')[0] : ''} onChange={e => onChange('data_ocorrencia', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Tipo</label>
              <select value={data.tipo || 'comportamental'} onChange={e => onChange('tipo', e.target.value)}>
                <option value="comportamental">Comportamental</option>
                <option value="atraso">Atraso</option>
                <option value="falta">Falta</option>
                <option value="merito">Mérito</option>
              </select>
            </div>
            <div className="form-group">
              <label>Gravidade</label>
              <select value={data.gravidade || 'leve'} onChange={e => onChange('gravidade', e.target.value)}>
                <option value="leve">Leve</option>
                <option value="media">Média</option>
                <option value="grave">Grave</option>
              </select>
            </div>
            <div className="form-group">
              <label>Educador ID</label>
              <input type="number" value={data.educador_id || ''} onChange={e => onChange('educador_id', Number(e.target.value))} />
            </div>
            <div className="form-group span-2">
              <label>Descrição *</label>
              <textarea value={data.descricao || ''} onChange={e => onChange('descricao', e.target.value)} required />
            </div>
          </div>
        </>
      )}
    />
  );
}
