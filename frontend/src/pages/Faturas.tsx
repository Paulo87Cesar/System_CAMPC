import React from 'react';
import CrudPage from '../components/CrudPage';

function statusBadge(s: string) {
  if (s === 'pago') return <span className="badge badge-green">Pago</span>;
  if (s === 'vencido') return <span className="badge badge-red">Vencido</span>;
  return <span className="badge badge-yellow">Pendente</span>;
}

const defaultForm = {
  empresa_id: '', competencia: '', valor_total: 0, status: 'pendente', data_vencimento: '', data_pagamento: ''
};

export default function FaturasPage() {
  return (
    <CrudPage
      title="Faturas para Empresas"
      endpoint="/fatura_empresa"
      idKey="id"
      searchKeys={['competencia', 'status']}
      columns={[
        { label: 'Empresa ID', key: 'empresa_id' },
        { label: 'Competência', key: 'competencia' },
        { label: 'Valor Total', key: 'valor_total', render: r => `R$ ${Number(r.valor_total).toFixed(2)}` },
        { label: 'Vencimento', key: 'data_vencimento', render: r => new Date(r.data_vencimento).toLocaleDateString('pt-BR') },
        { label: 'Status', key: 'status', render: r => statusBadge(r.status) }
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => (
        <>
          <div className="form-grid">
            <div className="form-group">
              <label>ID da Empresa *</label>
              <input type="number" value={data.empresa_id || ''} onChange={e => onChange('empresa_id', Number(e.target.value))} required />
            </div>
            <div className="form-group">
              <label>Competência (YYYY-MM) *</label>
              <input type="month" value={data.competencia || ''} onChange={e => onChange('competencia', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Valor Total (R$) *</label>
              <input type="number" step="0.01" value={data.valor_total || ''} onChange={e => onChange('valor_total', Number(e.target.value))} required />
            </div>
            <div className="form-group">
              <label>Data de Vencimento *</label>
              <input type="date" value={data.data_vencimento ? data.data_vencimento.split('T')[0] : ''} onChange={e => onChange('data_vencimento', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={data.status || 'pendente'} onChange={e => onChange('status', e.target.value)}>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="vencido">Vencido</option>
              </select>
            </div>
            <div className="form-group">
              <label>Data de Pagamento</label>
              <input type="date" value={data.data_pagamento ? data.data_pagamento.split('T')[0] : ''} onChange={e => onChange('data_pagamento', e.target.value)} />
            </div>
          </div>
        </>
      )}
    />
  );
}
