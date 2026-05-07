import React from 'react';
import CrudPage from '../components/CrudPage';

function statusBadge(s: string) {
  if (s === 'pago') return <span className="badge badge-green">Pago</span>;
  return <span className="badge badge-yellow">Pendente</span>;
}

const defaultForm = {
  competencia: '', contrato_id: '', valor_bruto: 0, descontos: 0, valor_liquido: 0, status: 'pendente', data_pagamento: ''
};

export default function FolhaPagamentoPage() {
  
  const handleDownloadPDF = (id: number) => {
    window.open(`http://localhost:3000/api/pdf/recibo_pagamento/${id}`, '_blank');
  };

  return (
    <CrudPage
      title="Folha de Pagamento"
      endpoint="/folha_pagamento"
      idKey="id"
      searchKeys={['competencia']}
      columns={[
        { label: 'Competência', key: 'competencia' },
        { label: 'Contrato ID', key: 'contrato_id' },
        { label: 'Líquido (R$)', key: 'valor_liquido', render: r => `R$ ${Number(r.valor_liquido).toFixed(2)}` },
        { label: 'Status', key: 'status', render: r => statusBadge(r.status) },
        { 
          label: 'Ações', 
          key: 'acoes', 
          render: r => (
            <button 
              onClick={(e) => { e.stopPropagation(); handleDownloadPDF(r.id); }} 
              className="btn-secondary" 
              style={{ padding: '4px 8px', fontSize: '12px' }}
            >
              📄 Recibo PDF
            </button>
          ) 
        }
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => {
        // Auto calculate liquido
        const bruto = Number(data.valor_bruto || 0);
        const desc = Number(data.descontos || 0);
        const liq = bruto - desc;
        
        if (data.valor_liquido !== liq) {
          setTimeout(() => onChange('valor_liquido', liq), 0);
        }

        return (
          <>
            <div className="form-grid">
              <div className="form-group">
                <label>Competência (YYYY-MM) *</label>
                <input type="month" value={data.competencia || ''} onChange={e => onChange('competencia', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>ID do Contrato *</label>
                <input type="number" value={data.contrato_id || ''} onChange={e => onChange('contrato_id', Number(e.target.value))} required />
              </div>
              <div className="form-group">
                <label>Valor Bruto (R$) *</label>
                <input type="number" step="0.01" value={data.valor_bruto || ''} onChange={e => onChange('valor_bruto', Number(e.target.value))} required />
              </div>
              <div className="form-group">
                <label>Descontos (R$)</label>
                <input type="number" step="0.01" value={data.descontos || ''} onChange={e => onChange('descontos', Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label>Valor Líquido (R$)</label>
                <input type="number" value={liq} disabled style={{ backgroundColor: '#f5f5f5' }} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={data.status || 'pendente'} onChange={e => onChange('status', e.target.value)}>
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                </select>
              </div>
              <div className="form-group">
                <label>Data de Pagamento</label>
                <input type="date" value={data.data_pagamento ? data.data_pagamento.split('T')[0] : ''} onChange={e => onChange('data_pagamento', e.target.value)} />
              </div>
            </div>
          </>
        );
      }}
    />
  );
}
