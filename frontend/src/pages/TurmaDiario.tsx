import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

interface DiarioAluno {
  codigo_turma: string;
  nome_curso: string;
  nome_educador: string;
  matricula_aluno: string;
  nome_aluno: string;
  status_aluno: string;
  total_dias_letivos: number;
  total_presencas: number;
  total_faltas: number;
}

export default function TurmaDiario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<DiarioAluno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/turmas/${id}/diario`)
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  if (data.length === 0) {
    return (
      <div className="crud-page">
        <div className="crud-header">
          <h2>Diário da Turma</h2>
          <button className="btn-secondary" onClick={() => navigate('/turmas')}>Voltar</button>
        </div>
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <p>Nenhum aluno encontrado ou diário não disponível para esta turma.</p>
        </div>
      </div>
    );
  }

  const turma = data[0];

  return (
    <div className="crud-page">
      <div className="crud-header">
        <h2>Diário de Classe: Turma {turma.codigo_turma}</h2>
        <button className="btn-secondary" onClick={() => navigate('/turmas')}>Voltar às Turmas</button>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 24, background: 'linear-gradient(135deg, var(--green) 0%, var(--blue-brand) 100%)', color: 'white' }}>
        <h3 style={{ margin: 0, fontSize: '24px' }}>Curso: {turma.nome_curso}</h3>
        <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>Educador Responsável: {turma.nome_educador}</p>
        <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>Total de Alunos Matriculados: {data.length}</p>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h4 style={{ margin: '0 0 16px 0', color: 'var(--text-dark)' }}>Frequência dos Alunos</h4>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nome do Aluno</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Presenças</th>
                <th style={{ textAlign: 'center' }}>Faltas</th>
                <th style={{ textAlign: 'center' }}>Frequência %</th>
              </tr>
            </thead>
            <tbody>
              {data.map((aluno, i) => {
                const perc = aluno.total_dias_letivos > 0 
                  ? ((aluno.total_presencas / aluno.total_dias_letivos) * 100).toFixed(1) 
                  : 0;
                  
                return (
                  <tr key={i}>
                    <td>{aluno.matricula_aluno}</td>
                    <td>{aluno.nome_aluno}</td>
                    <td>
                      <span className={`badge ${aluno.status_aluno === 'Cursando' ? 'badge-blue' : aluno.status_aluno === 'Desistente' ? 'badge-red' : 'badge-green'}`}>
                        {aluno.status_aluno}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', color: 'green', fontWeight: 600 }}>{aluno.total_presencas}</td>
                    <td style={{ textAlign: 'center', color: aluno.total_faltas > 0 ? 'red' : 'inherit' }}>{aluno.total_faltas}</td>
                    <td style={{ textAlign: 'center' }}>
                      {aluno.total_dias_letivos > 0 ? `${perc}%` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
