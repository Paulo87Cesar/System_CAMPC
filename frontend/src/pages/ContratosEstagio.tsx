import React from 'react';
import CrudPage from '../components/CrudPage';

function statusBadge(s: string) {
  if (s === 'Ativo') return <span className="badge badge-green">Ativo</span>;
  if (s === 'Encerrado') return <span className="badge badge-grey">Encerrado</span>;
  return <span className="badge badge-red">Rescindido</span>;
}

const defaultForm = {
  jovem_id: '', empresa_id: '', escola_id: '', supervisor: '', valor_bolsa: 0, carga_horaria_semanal: 30, data_inicio: '', data_fim: '', status: 'Ativo'
};

export default function ContratosEstagioPage() {
  return (
    <CrudPage
      title="Contratos de Estágio"
      endpoint="/contrato_estagio"
      idKey="id"
      searchKeys={['supervisor', 'status']}
      columns={[
        { label: 'Jovem ID', key: 'jovem_id' },
        { label: 'Empresa ID', key: 'empresa_id' },
        { label: 'Escola ID', key: 'escola_id' },
        { label: 'Bolsa (R$)', key: 'valor_bolsa', render: r => `R$ ${Number(r.valor_bolsa).toFixed(2)}` },
        { label: 'Status', key: 'status', render: r => statusBadge(r.status) }
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
              <label>ID da Empresa *</label>
              <input type="number" value={data.empresa_id || ''} onChange={e => onChange('empresa_id', Number(e.target.value))} required />
            </div>
            <div className="form-group">
              <label>ID da Escola Instituição</label>
              <input type="number" value={data.escola_id || ''} onChange={e => onChange('escola_id', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Supervisor</label>
              <input type="text" value={data.supervisor || ''} onChange={e => onChange('supervisor', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Valor da Bolsa (R$) *</label>
              <input type="number" step="0.01" value={data.valor_bolsa || ''} onChange={e => onChange('valor_bolsa', Number(e.target.value))} required />
            </div>
            <div className="form-group">
              <label>Carga Horária Semanal (h)</label>
              <input type="number" value={data.carga_horaria_semanal || ''} onChange={e => onChange('carga_horaria_semanal', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Data de Início *</label>
              <input type="date" value={data.data_inicio ? data.data_inicio.split('T')[0] : ''} onChange={e => onChange('data_inicio', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Data de Fim *</label>
              <input type="date" value={data.data_fim ? data.data_fim.split('T')[0] : ''} onChange={e => onChange('data_fim', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={data.status || 'Ativo'} onChange={e => onChange('status', e.target.value)}>
                <option value="Ativo">Ativo</option>
                <option value="Encerrado">Encerrado</option>
                <option value="Rescindido">Rescindido</option>
              </select>
            </div>
          </div>
        </>
      )}
    />
  );
}
