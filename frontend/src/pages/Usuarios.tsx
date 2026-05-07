import React from 'react';
import CrudPage from '../components/CrudPage';

function badge(ativo: boolean) {
  if (ativo) return <span className="badge badge-green">Ativo</span>;
  return <span className="badge badge-grey">Inativo</span>;
}

const defaultForm = {
  nome: '', email: '', senha_hash: '', perfil_id: '', ativo: true
};

export default function UsuariosPage() {
  return (
    <CrudPage
      title="Usuários do Sistema"
      endpoint="/usuarios"
      idKey="id"
      searchKeys={['nome', 'email']}
      columns={[
        { label: 'Nome', key: 'nome' },
        { label: 'E-mail', key: 'email' },
        { label: 'Perfil ID', key: 'perfil_id' },
        { label: 'Situação', key: 'ativo', render: r => badge(r.ativo) }
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => (
        <>
          <div className="form-grid">
            <div className="form-group span-2">
              <label>Nome Completo *</label>
              <input type="text" value={data.nome || ''} onChange={e => onChange('nome', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>E-mail (Login) *</label>
              <input type="email" value={data.email || ''} onChange={e => onChange('email', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Senha *</label>
              <input type="password" value={data.senha_hash || ''} onChange={e => onChange('senha_hash', e.target.value)} required placeholder="Nova senha" />
            </div>
            <div className="form-group">
              <label>Perfil ID</label>
              <input type="number" value={data.perfil_id || ''} onChange={e => onChange('perfil_id', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Ativo?</label>
              <select value={data.ativo ? 'true' : 'false'} onChange={e => onChange('ativo', e.target.value === 'true')}>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
          </div>
        </>
      )}
    />
  );
}
