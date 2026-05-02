import React from 'react';
import CrudPage from '../components/CrudPage';

const defaultForm = { nome: '', email: '', cpf: '', telefone: '', especialidade: '', ativo: 'S' };

export default function EducadoresPage() {
  return (
    <CrudPage
      title="Educadores"
      endpoint="/educadores"
      idKey="id_educador"
      searchKeys={['nome', 'email', 'especialidade']}
      columns={[
        { label: 'Nome', key: 'nome', render: r => <button className="link-btn">{r.nome}</button> },
        { label: 'E-mail', key: 'email' },
        { label: 'Telefone', key: 'telefone' },
        { label: 'Especialidade', key: 'especialidade' },
        { label: 'Situação', key: 'ativo', render: r => (
          <span className={`badge ${r.ativo === 'S' ? 'badge-green' : 'badge-grey'}`}>
            {r.ativo === 'S' ? 'Ativo' : 'Inativo'}
          </span>
        )},
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => (
        <div className="form-grid">
          <div className="form-group span-2">
            <label>Nome *</label>
            <input type="text" value={data.nome || ''} onChange={e => onChange('nome', e.target.value)} />
          </div>
          <div className="form-group">
            <label>E-mail</label>
            <input type="email" value={data.email || ''} onChange={e => onChange('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label>CPF</label>
            <input type="text" value={data.cpf || ''} onChange={e => onChange('cpf', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <input type="text" value={data.telefone || ''} onChange={e => onChange('telefone', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Especialidade</label>
            <input type="text" value={data.especialidade || ''} onChange={e => onChange('especialidade', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Situação</label>
            <select value={data.ativo || 'S'} onChange={e => onChange('ativo', e.target.value)}>
              <option value="S">Ativo</option><option value="N">Inativo</option>
            </select>
          </div>
        </div>
      )}
    />
  );
}
