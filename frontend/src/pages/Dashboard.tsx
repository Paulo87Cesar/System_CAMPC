import React, { useEffect, useState } from 'react';
import { Users, ClipboardList, Calendar, GraduationCap, Building2, Handshake } from 'lucide-react';
import api from '../api';

interface Stats {
  jovens: number;
  inscricoes: number;
  turmasAtivas: number;
  educadores: number;
  empresasAtivas: number;
  contratosAtivos: number;
  inscricoesPorStatus: { status_processo: string; total: number }[];
  matriculasPorStatus: { status_matricula: string; total: number }[];
}

function statusBadge(s: string) {
  const map: Record<string, string> = {
    Aprovado: 'badge-green', Pendente: 'badge-yellow', Reprovado: 'badge-red',
    Cursando: 'badge-blue', Concluído: 'badge-green', Desistente: 'badge-red',
    Transferido: 'badge-grey',
  };
  return `badge ${map[s] || 'badge-grey'}`;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get<Stats>('/dashboard/stats')
      .then(r => setStats(r.data))
      .catch(() => setErr('Não foi possível conectar ao banco de dados.\nVerifique se o MySQL está ativo e as credenciais no arquivo .env estão corretas.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-content"><div className="loading"><div className="spinner" /></div></div>;

  if (err) return (
    <div className="page-content">
      <div className="card" style={{ borderLeft: '4px solid var(--red)' }}>
        <div className="card-body">
          <p style={{ fontWeight: 700, color: 'var(--red)', marginBottom: 6 }}>⚠️ Sem conexão com o banco</p>
          <pre style={{ fontSize: 12, color: 'var(--neutral-7)', whiteSpace: 'pre-wrap' }}>{err}</pre>
          <p style={{ marginTop: 12, fontSize: 12, color: 'var(--neutral-5)' }}>
            Configure o arquivo <code>appERP/.env</code> com as credenciais corretas do MySQL e reinicie o servidor com <code>npm run dev</code>.
          </p>
        </div>
      </div>
    </div>
  );

  const s = stats!;
  return (
    <div className="page-content">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <span className="stat-label">Jovens Cadastrados</span>
          <span className="stat-value">{s.jovens}</span>
          <span className="stat-sub">ficha ativa</span>
        </div>
        <div className="stat-card green">
          <span className="stat-label">Inscrições</span>
          <span className="stat-value">{s.inscricoes}</span>
          <span className="stat-sub">total 2026</span>
        </div>
        <div className="stat-card yellow">
          <span className="stat-label">Empresas Parceiras</span>
          <span className="stat-value">{s.empresasAtivas}</span>
          <span className="stat-sub">ativas</span>
        </div>
        <div className="stat-card purple">
          <span className="stat-label">Contratos Ativos</span>
          <span className="stat-value">{s.contratosAtivos}</span>
          <span className="stat-sub">jovem-empresa</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Inscrições por status */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Inscrições por Status</span>
          </div>
          <div className="card-body">
            {s.inscricoesPorStatus.length === 0
              ? <p style={{ color: 'var(--neutral-5)', fontSize: 13 }}>Nenhuma inscrição.</p>
              : s.inscricoesPorStatus.map(r => (
                <div key={r.status_processo}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span className={statusBadge(r.status_processo)}>{r.status_processo || 'Indefinido'}</span>
                  <strong style={{ fontSize: 18 }}>{r.total}</strong>
                </div>
              ))
            }
          </div>
        </div>

        {/* Matrículas por status */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Matrículas por Status</span>
          </div>
          <div className="card-body">
            {s.matriculasPorStatus.length === 0
              ? <p style={{ color: 'var(--neutral-5)', fontSize: 13 }}>Nenhuma matrícula.</p>
              : s.matriculasPorStatus.map(r => (
                <div key={r.status_matricula}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span className={statusBadge(r.status_matricula)}>{r.status_matricula}</span>
                  <strong style={{ fontSize: 18 }}>{r.total}</strong>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}
