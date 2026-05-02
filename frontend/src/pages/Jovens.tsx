import React from 'react';
import CrudPage from '../components/CrudPage';

function badge(s: string) {
  if (!s || s === 'N') return <span className="badge badge-green">Ativo</span>;
  return <span className="badge badge-grey">Inativo</span>;
}

function approvalBadge(s: string) {
  const map: Record<string, string> = {
    'Aprovado': 'badge-green', 'Em Análise': 'badge-yellow', 'Reprovado': 'badge-red'
  };
  return <span className={`badge ${map[s] || 'badge-grey'}`}>{s || 'Em Análise'}</span>;
}

const defaultForm = {
  nome_completo: '', cpf: '', rg: '', genero: '', nascimento: '',
  email: '', telefone: '', celular: '', municipio: '', bairro: '',
  endereco: '', cep: '', escolaridade: '', escola: '', serie: '',
  aprovacao_status: 'Em Análise', inativo: 'N', observacoes_sociais: ''
};

export default function JovensPage() {
  return (
    <CrudPage
      title="Jovens"
      endpoint="/jovens"
      idKey="id_jovem"
      searchKeys={['nome_completo', 'cpf', 'email', 'municipio']}
      columns={[
        { label: 'Nome', key: 'nome_completo', render: r => <button className="link-btn">{r.nome_completo}</button> },
        { label: 'CPF', key: 'cpf' },
        { label: 'Gênero', key: 'genero' },
        { label: 'Município', key: 'municipio' },
        { label: 'E-mail', key: 'email' },
        { label: 'Status', key: 'aprovacao_status', render: r => approvalBadge(r.aprovacao_status) },
        { label: 'Situação', key: 'inativo', render: r => badge(r.inativo), width: '80px' },
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => (
        <>
          <p style={{ fontWeight: 600, marginBottom: 12, color: 'var(--blue-brand)' }}>📋 Dados Pessoais</p>
          <div className="form-grid">
            <div className="form-group span-2">
              <label>Nome Completo *</label>
              <input type="text" value={data.nome_completo || ''} onChange={e => onChange('nome_completo', e.target.value)} />
            </div>
            <div className="form-group">
              <label>CPF</label>
              <input type="text" value={data.cpf || ''} onChange={e => onChange('cpf', e.target.value)} placeholder="000.000.000-00" />
            </div>
            <div className="form-group">
              <label>RG</label>
              <input type="text" value={data.rg || ''} onChange={e => onChange('rg', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Nascimento</label>
              <input type="date" value={data.nascimento || ''} onChange={e => onChange('nascimento', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Gênero</label>
              <select value={data.genero || ''} onChange={e => onChange('genero', e.target.value)}>
                <option value="">Selecione</option>
                <option>Masculino</option><option>Feminino</option><option>Não-binário</option><option>Prefiro não informar</option>
              </select>
            </div>
            <div className="form-group">
              <label>E-mail</label>
              <input type="email" value={data.email || ''} onChange={e => onChange('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input type="text" value={data.telefone || ''} onChange={e => onChange('telefone', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Celular</label>
              <input type="text" value={data.celular || ''} onChange={e => onChange('celular', e.target.value)} />
            </div>
            <div className="form-group">
              <label>CEP</label>
              <input type="text" value={data.cep || ''} onChange={e => onChange('cep', e.target.value)} />
            </div>
            <div className="form-group span-2">
              <label>Endereço</label>
              <input type="text" value={data.endereco || ''} onChange={e => onChange('endereco', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Bairro</label>
              <input type="text" value={data.bairro || ''} onChange={e => onChange('bairro', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Município</label>
              <input type="text" value={data.municipio || ''} onChange={e => onChange('municipio', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Escolaridade</label>
              <input type="text" value={data.escolaridade || ''} onChange={e => onChange('escolaridade', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Escola</label>
              <input type="text" value={data.escola || ''} onChange={e => onChange('escola', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Status de Aprovação</label>
              <select value={data.aprovacao_status || 'Em Análise'} onChange={e => onChange('aprovacao_status', e.target.value)}>
                <option>Em Análise</option><option>Aprovado</option><option>Reprovado</option>
              </select>
            </div>
            <div className="form-group">
              <label>Situação</label>
              <select value={data.inativo || 'N'} onChange={e => onChange('inativo', e.target.value)}>
                <option value="N">Ativo</option><option value="S">Inativo</option>
              </select>
            </div>
            <div className="form-group span-2">
              <label>Observações Sociais</label>
              <textarea value={data.observacoes_sociais || ''} onChange={e => onChange('observacoes_sociais', e.target.value)} />
            </div>
          </div>
        </>
      )}
    />
  );
}
