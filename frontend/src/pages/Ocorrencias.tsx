import React, { useState, useEffect } from 'react';
import CrudPage from '../components/CrudPage';
import api from '../api';

interface Ocorrencia {
  id?: number;
  jovem_id: string | number;
  matricula_busca?: string;
  tipo: string;
  gravidade: string;
  descricao: string;
  data_ocorrencia: string;
  educador_id?: string | number;
  nome_jovem?: string;
  matricula_jovem?: string;
  nome_educador?: string;
  criado_por?: string;
  criado_em?: string;
}

const defaultForm: Partial<Ocorrencia> = {
  jovem_id: '',
  matricula_busca: '',
  tipo: 'comportamental',
  gravidade: 'leve',
  descricao: '',
  data_ocorrencia: new Date().toISOString().split('T')[0],
  educador_id: ''
};

export default function OcorrenciasPage() {
  const [jovens, setJovens] = useState<any[]>([]);
  const [educadores, setEducadores] = useState<any[]>([]);

  useEffect(() => {
    api.get('/jovens').then(r => setJovens(r.data)).catch(() => {});
    api.get('/educadores').then(r => setEducadores(r.data)).catch(() => {});
  }, []);

  return (
    <CrudPage<Ocorrencia>
      title="Ocorrências"
      endpoint="/ocorrencias"
      idKey="id"
      searchKeys={['tipo', 'gravidade', 'descricao', 'nome_jovem', 'matricula_jovem', 'nome_educador']}
      columns={[
        { label: 'Matrícula', key: 'matricula_jovem' },
        { label: 'Jovem', key: 'nome_jovem' },
        { label: 'Tipo', key: 'tipo', render: r => <span style={{ textTransform: 'capitalize' }}>{r.tipo}</span> },
        { label: 'Gravidade', key: 'gravidade', render: r => {
            const map: Record<string, string> = { leve: 'badge-blue', media: 'badge-yellow', grave: 'badge-red' };
            return <span className={`badge ${map[r.gravidade] || 'badge-grey'}`} style={{ textTransform: 'capitalize' }}>{r.gravidade}</span>;
          }
        },
        { label: 'Educador', key: 'nome_educador', render: r => r.nome_educador || '-' },
        { label: 'Data Ocorrência', key: 'data_ocorrencia', render: r => r.data_ocorrencia ? new Date(r.data_ocorrencia).toLocaleDateString('pt-BR') : '-' },
        { label: 'Registrado por', key: 'criado_por', render: r => r.criado_por || '-' },
        { label: 'Data/Hora Reg.', key: 'criado_em', render: r => r.criado_em ? new Date(r.criado_em).toLocaleString('pt-BR') : '-' }
      ]}
      defaultForm={defaultForm}
      renderForm={(data, onChange) => {
        const matchedJovem = data.jovem_id ? jovens.find(j => j.id_jovem === Number(data.jovem_id)) : null;
        const displayMatricula = data.matricula_busca !== undefined ? data.matricula_busca : (matchedJovem?.matricula || '');

        return (
          <>
            <div className="form-grid">
              <div className="form-group">
                <label>Matrícula do Jovem *</label>
                <input
                  type="text"
                  placeholder="Ex: 20260001"
                  value={displayMatricula}
                  onChange={e => {
                    const val = e.target.value;
                    onChange('matricula_busca', val);
                    const found = jovens.find(j => j.matricula === val);
                    if (found) {
                      onChange('jovem_id', found.id_jovem);
                    } else {
                      onChange('jovem_id', '');
                    }
                  }}
                  required
                />
                {data.jovem_id ? (
                  <div style={{ color: '#22c55e', fontSize: '0.875rem', marginTop: '4px', fontWeight: 500 }}>
                    ✓ Jovem: {matchedJovem?.nome_completo}
                  </div>
                ) : displayMatricula ? (
                  <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px', fontWeight: 500 }}>
                    ✗ Jovem não encontrado com esta matrícula
                  </div>
                ) : (
                  <div style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '4px' }}>
                    Digite a matrícula para buscar o jovem
                  </div>
                )}
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
                <label>Educador</label>
                <select
                  value={data.educador_id || ''}
                  onChange={e => onChange('educador_id', e.target.value ? Number(e.target.value) : '')}
                >
                  <option value="">Selecione o Educador</option>
                  {educadores.map(ed => (
                    <option key={ed.id_educador} value={ed.id_educador}>{ed.nome}</option>
                  ))}
                </select>
              </div>
              <div className="form-group span-2">
                <label>Descrição *</label>
                <textarea value={data.descricao || ''} onChange={e => onChange('descricao', e.target.value)} required />
              </div>
            </div>
          </>
        );
      }}
    />
  );
}
