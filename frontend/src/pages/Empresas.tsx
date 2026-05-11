import React from 'react';
import CrudPage from '../components/CrudPage';
import { maskCnpj, maskPhone } from '../utils/masks';
import { isValidCnpj, EmpresaSchema } from '../utils/validation';



interface Empresa {
  id_empresa?: number;
  razao_social: string;
  nome_fantasia?: string;
  cnpj: string;
  email?: string;
  telefone?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
  responsavel_rh?: string;
  cota_aprendizes?: number;
  ativo: string;
}

export default function EmpresasPage() {
  const defaultForm: Partial<Empresa> = {
    razao_social: '', nome_fantasia: '', cnpj: '',
    email: '', telefone: '', responsavel_rh: '',
    cota_aprendizes: 0, ativo: 'S', municipio: 'Campinas', uf: 'SP'
  };

  return (
    <CrudPage<Empresa>
      title="Empresas Parceiras"
      endpoint="/empresas"
      idKey="id_empresa"
      searchKeys={['razao_social', 'nome_fantasia', 'cnpj']}
      validationSchema={EmpresaSchema}
      columns={[
        { label: 'Nome Fantasia', key: 'nome_fantasia', render: r => <button className="link-btn">{r.nome_fantasia || r.razao_social}</button> },
        { label: 'CNPJ', key: 'cnpj' },
        { label: 'Cidade', key: 'municipio' },
        { label: 'Responsável RH', key: 'responsavel_rh' },
        { label: 'Cota', key: 'cota_aprendizes' },
        { label: 'Status', key: 'ativo', render: r => (
          <span className={`badge ${r.ativo === 'S' ? 'badge-green' : 'badge-grey'}`}>{r.ativo === 'S' ? 'Ativa' : 'Inativa'}</span>
        )},
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => (
        <div className="form-grid">
          <div className="form-group span-2">
            <label>Razão Social *</label>
            <input type="text" value={data.razao_social || ''} onChange={e => onChange('razao_social', e.target.value)} />
          </div>
          <div className="form-group span-2">
            <label>Nome Fantasia</label>
            <input type="text" value={data.nome_fantasia || ''} onChange={e => onChange('nome_fantasia', e.target.value)} />
          </div>
          <div className="form-group">
            <label>CNPJ *</label>
            <input 
              type="text" 
              value={data.cnpj || ''} 
              onChange={e => onChange('cnpj', maskCnpj(e.target.value))} 
              placeholder="00.000.000/0000-00"
              style={{ borderColor: data.cnpj && !isValidCnpj(data.cnpj) ? 'var(--red)' : '' }}
            />
            {data.cnpj && !isValidCnpj(data.cnpj) && <small style={{ color: 'var(--red)' }}>CNPJ Inválido</small>}
          </div>
          <div className="form-group">
            <label>Cota de Aprendizes</label>
            <input type="number" value={data.cota_aprendizes || 0} onChange={e => onChange('cota_aprendizes', Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label>E-mail</label>
            <input type="email" value={data.email || ''} onChange={e => onChange('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <input type="text" value={data.telefone || ''} onChange={e => onChange('telefone', maskPhone(e.target.value))} />
          </div>
          <div className="form-group span-2">
            <label>Responsável RH</label>
            <input type="text" value={data.responsavel_rh || ''} onChange={e => onChange('responsavel_rh', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Logradouro</label>
            <input type="text" value={data.logradouro || ''} onChange={e => onChange('logradouro', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Número</label>
            <input type="text" value={data.numero || ''} onChange={e => onChange('numero', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Bairro</label>
            <input type="text" value={data.bairro || ''} onChange={e => onChange('bairro', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Município</label>
            <input type="text" value={data.municipio || 'Campinas'} onChange={e => onChange('municipio', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={data.ativo || 'S'} onChange={e => onChange('ativo', e.target.value)}>
              <option value="S">Ativa</option><option value="N">Inativa</option>
            </select>
          </div>
        </div>
      )}
    />
  );
}
