import React, { useEffect, useState } from 'react';
import CrudPage from '../components/CrudPage';
import api from '../api';

interface Jovem { id_jovem: number; nome_completo: string; }
interface Empresa { id_empresa: number; nome_fantasia: string; razao_social: string; }

interface Contrato {
  id_contrato?: number;
  id_jovem: string | number;
  id_empresa: string | number;
  data_inicio: string;
  data_fim: string;
  cargo?: string;
  salario?: number;
  status_contrato: string;
  nome_jovem?: string;
  nome_empresa?: string;
}

export default function ContratosPage() {
  const [jovens, setJovens] = useState<Jovem[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);

  useEffect(() => {
    api.get<Jovem[]>('/jovens').then(r => setJovens(r.data)).catch(() => {});
    api.get<Empresa[]>('/empresas').then(r => setEmpresas(r.data)).catch(() => {});
  }, []);

  const defaultForm: Partial<Contrato> = {
    id_jovem: '', id_empresa: '', data_inicio: '', data_fim: '',
    cargo: 'Aprendiz Administrativo', salario: 0, status_contrato: 'Ativo'
  };

  return (
    <CrudPage<Contrato>
      title="Contratos Jovem-Empresa"
      endpoint="/contratos"
      idKey="id_contrato"
      searchKeys={['nome_jovem', 'nome_empresa', 'cargo']}
      columns={[
        { label: 'Jovem', key: 'nome_jovem', render: r => <button className="link-btn">{r.nome_jovem}</button> },
        { label: 'Empresa', key: 'nome_empresa' },
        { label: 'Início', key: 'data_inicio', render: r => new Date(r.data_inicio).toLocaleDateString('pt-BR') },
        { label: 'Fim', key: 'data_fim', render: r => new Date(r.data_fim).toLocaleDateString('pt-BR') },
        { label: 'Cargo', key: 'cargo' },
        { label: 'Status', key: 'status_contrato', render: r => (
          <span className={`badge ${r.status_contrato === 'Ativo' ? 'badge-green' : r.status_contrato === 'Rescindido' ? 'badge-red' : 'badge-grey'}`}>
            {r.status_contrato}
          </span>
        )},
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => (
        <div className="form-grid">
          <div className="form-group span-2">
            <label>Jovem *</label>
            <select value={data.id_jovem || ''} onChange={e => onChange('id_jovem', e.target.value)}>
              <option value="">Selecione o jovem</option>
              {jovens.map(j => <option key={j.id_jovem} value={j.id_jovem}>{j.nome_completo}</option>)}
            </select>
          </div>
          <div className="form-group span-2">
            <label>Empresa *</label>
            <select value={data.id_empresa || ''} onChange={e => onChange('id_empresa', e.target.value)}>
              <option value="">Selecione a empresa</option>
              {empresas.map(e => <option key={e.id_empresa} value={e.id_empresa}>{e.nome_fantasia || e.razao_social}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Data Início *</label>
            <input type="date" value={data.data_inicio || ''} onChange={e => onChange('data_inicio', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Data Fim *</label>
            <input type="date" value={data.data_fim || ''} onChange={e => onChange('data_fim', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Cargo</label>
            <input type="text" value={data.cargo || ''} onChange={e => onChange('cargo', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Salário</label>
            <input type="number" value={data.salario || 0} onChange={e => onChange('salario', Number(e.target.value))} />
          </div>
          <div className="form-group">
            <label>Status do Contrato</label>
            <select value={data.status_contrato || 'Ativo'} onChange={e => onChange('status_contrato', e.target.value)}>
              <option>Ativo</option>
              <option>Encerrado</option>
              <option>Rescindido</option>
            </select>
          </div>
        </div>
      )}
    />
  );
}
