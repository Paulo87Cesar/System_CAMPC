import React from 'react';
import CrudPage from '../components/CrudPage';
import { fetchAddressByCep } from '../utils/viaCep';
import { maskCep, maskCpf, maskPhone, maskRg } from '../utils/masks';

import { isValidCpf, JovemSchema } from '../utils/validation';





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
      validationSchema={JovemSchema}
      columns={[
        { label: 'Matrícula', key: 'matricula' },
        { label: 'Nome', key: 'nome_completo', render: r => <button className="link-btn">{r.nome_completo}</button> },
        { label: 'CPF', key: 'cpf' },
        { label: 'Gênero', key: 'genero' },
        { label: 'Município', key: 'municipio' },
        { label: 'E-mail', key: 'email' },
        { label: 'Status', key: 'aprovacao_status', render: r => approvalBadge(r.aprovacao_status) },
        { label: 'Situação', key: 'inativo', render: r => badge(r.inativo), width: '80px' },
        { 
          label: 'Ações', 
          key: 'acoes', 
          render: r => (
            <button 
              className="btn-secondary" 
              style={{ padding: '4px 8px', fontSize: '12px' }} 
              onClick={(e) => { 
                e.stopPropagation(); 
                window.open(`/jovens/${r.id_jovem}/historico`, '_self'); 
              }}
            >
              📖 Histórico
            </button>
          ) 
        },
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => (
        <>
          <p style={{ fontWeight: 600, marginBottom: 12, color: 'var(--blue-brand)' }}>📋 Dados Pessoais</p>
          <div className="form-grid">
            <div className="form-group">
            <label>Matrícula</label>
            <input type="text" value={data.matricula || ''} disabled />
          </div>
          <div className="form-group span-2">
            <label>Nome Completo *</label>
            <input type="text" value={data.nome_completo || ''} onChange={e => onChange('nome_completo', e.target.value)} />
          </div>
            <div className="form-group">
              <label>CPF</label>
              <input 
                type="text" 
                value={data.cpf || ''} 
                onChange={e => onChange('cpf', maskCpf(e.target.value))} 
                placeholder="000.000.000-00" 
                style={{ borderColor: data.cpf && !isValidCpf(data.cpf) ? 'var(--red)' : '' }}
              />
              {data.cpf && !isValidCpf(data.cpf) && <small style={{ color: 'var(--red)' }}>CPF Inválido</small>}
            </div>
            <div className="form-group">
              <label>RG</label>
              <input 
                type="text" 
                value={data.rg || ''} 
                onChange={e => onChange('rg', maskRg(e.target.value))} 
                style={{ borderColor: data.rg && data.rg.length < 8 ? 'var(--red)' : '' }}
              />
              {data.rg && data.rg.length < 8 && <small style={{ color: 'var(--red)' }}>RG inválido ou incompleto</small>}
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
              <input type="text" value={data.telefone || ''} onChange={e => onChange('telefone', maskPhone(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Celular</label>
              <input type="text" value={data.celular || ''} onChange={e => onChange('celular', maskPhone(e.target.value))} />
            </div>
            <div className="form-group">
              <label>CEP</label>
              <input 
                type="text" 
                value={data.cep || ''} 
                onChange={e => onChange('cep', maskCep(e.target.value))} 
                onBlur={async (e) => {
                  const cep = e.target.value;
                  if (cep.length >= 8) {
                    const address = await fetchAddressByCep(cep);
                    if (address) {
                      onChange('endereco', address.logradouro);
                      onChange('bairro', address.bairro);
                      onChange('municipio', `${address.localidade} - ${address.uf}`);
                    }
                  }
                }}
              />
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
