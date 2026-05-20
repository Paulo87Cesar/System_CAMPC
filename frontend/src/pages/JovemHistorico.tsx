import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

interface HistoricoItem {
  matricula_institucional: string;
  nome_jovem: string;
  nome_projeto: string;
  nome_programa: string;
  nome_curso: string;
  codigo_turma: string;
  situacao_na_turma: string;
  nome_disciplina: string;
  periodo_avaliacao: string;
  nota_avaliacao: number | string;
  faltas_disciplina: number;
}

export default function JovemHistorico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/jovens/${id}/historico`)
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  if (data.length === 0) {
    return (
      <div className="crud-page">
        <div className="crud-header">
          <h2>Histórico do Jovem</h2>
          <button className="btn-secondary" onClick={() => navigate('/jovens')}>Voltar</button>
        </div>
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <p>Nenhum histórico acadêmico encontrado para este jovem.</p>
        </div>
      </div>
    );
  }

  const jovem = {
    matricula: data[0].matricula_institucional,
    nome: data[0].nome_jovem
  };

  // Group by project -> program -> course -> class
  const turmasMap = new Map<string, {
    projeto: string; programa: string; curso: string; turma: string; situacao: string;
    disciplinas: HistoricoItem[]
  }>();

  data.forEach(item => {
    if (!turmasMap.has(item.codigo_turma)) {
      turmasMap.set(item.codigo_turma, {
        projeto: item.nome_projeto,
        programa: item.nome_programa,
        curso: item.nome_curso,
        turma: item.codigo_turma,
        situacao: item.situacao_na_turma,
        disciplinas: []
      });
    }
    if (item.nome_disciplina) {
      turmasMap.get(item.codigo_turma)!.disciplinas.push(item);
    }
  });

  return (
    <div className="crud-page">
      <div className="crud-header">
        <h2>Histórico Geral: {jovem.nome}</h2>
        <button className="btn-secondary" onClick={() => navigate('/jovens')}>Voltar aos Jovens</button>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 24, background: 'linear-gradient(135deg, var(--blue-brand) 0%, var(--purple-brand) 100%)', color: 'white' }}>
        <h3 style={{ margin: 0, fontSize: '24px' }}>{jovem.nome}</h3>
        <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>Matrícula Institucional: {jovem.matricula}</p>
      </div>

      {Array.from(turmasMap.values()).map((t, i) => (
        <div key={i} className="card" style={{ padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <span className="badge badge-grey">{t.projeto}</span>
              <span className="badge badge-grey" style={{ marginLeft: 8 }}>{t.programa}</span>
              <h4 style={{ margin: '8px 0', color: 'var(--text-dark)', fontSize: '18px' }}>
                {t.curso} (Turma: {t.turma})
              </h4>
            </div>
            <div>
              <span className={`badge ${t.situacao === 'Cursando' ? 'badge-blue' : t.situacao === 'Concluído' ? 'badge-green' : 'badge-yellow'}`}>
                {t.situacao}
              </span>
            </div>
          </div>

          {t.disciplinas.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Disciplina</th>
                  <th>Período</th>
                  <th>Nota</th>
                  <th>Faltas</th>
                </tr>
              </thead>
              <tbody>
                {t.disciplinas.map((d, idx) => (
                  <tr key={idx}>
                    <td>{d.nome_disciplina}</td>
                    <td>{d.periodo_avaliacao || '-'}</td>
                    <td>
                      {d.nota_avaliacao === 'Sem nota' ? (
                        <span style={{ color: '#999', fontStyle: 'italic' }}>Sem nota</span>
                      ) : (
                        <strong>{d.nota_avaliacao}</strong>
                      )}
                    </td>
                    <td>{d.faltas_disciplina}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#666', fontStyle: 'italic' }}>Nenhuma disciplina cadastrada para esta turma.</p>
          )}
        </div>
      ))}
    </div>
  );
}
