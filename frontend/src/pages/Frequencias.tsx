import React, { useEffect, useState, useCallback } from 'react';
import { Search, Users, ClipboardCheck, BarChart3, Printer, Save, ChevronRight, Calendar, BookOpen, Maximize2, Minimize2, X } from 'lucide-react';
import api from '../api';
import { useToast } from '../context/ToastContext';

/* ─── Types ─── */
interface Turma { id_turma: number; codigo_turma: string; periodo: string; nome_curso?: string; nome_educador?: string; ativo?: string; }
interface Educador { id_educador: number; nome: string; }
interface Aluno {
  id_matricula: number;
  nome_completo: string;
  matricula_aluno: string;
  status_matricula: string;
  // freq fields (populated after load)
  presente?: boolean;
  justificativa?: string;
  observacao_individual?: string;
}
interface AulaInfo {
  id_aula?: number;
  periodo?: string;
  id_educador?: number;
  conteudo_ministrado?: string;
  observacoes_gerais?: string;
}
interface ResumoAluno {
  nome_completo: string;
  matricula_aluno: string;
  total_aulas_lancadas: number;
  total_presencas: number;
  total_faltas: number;
}

/* ─── Main Component ─── */
export default function FrequenciasPage() {
  const { show } = useToast();
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);

  // Turma lookup
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [educadores, setEducadores] = useState<Educador[]>([]);
  const [selectedTurmaId, setSelectedTurmaId] = useState<number | ''>('');
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);

  // Tab 1 – Aula info
  const [dataAula, setDataAula] = useState(new Date().toISOString().split('T')[0]);
  const [periodo, setPeriodo] = useState<string>('');
  const [educadorId, setEducadorId] = useState<number | ''>('');
  const [conteudo, setConteudo] = useState('');
  const [obsGerais, setObsGerais] = useState('');

  // Tab 2 – Alunos / Grid
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const [hasFreqData, setHasFreqData] = useState(false);

  // Tab 3 – Resumo
  const [resumo, setResumo] = useState<ResumoAluno[]>([]);
  const [loadingResumo, setLoadingResumo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load turmas & educadores
  useEffect(() => {
    api.get<Turma[]>('/turmas').then(r => setTurmas(r.data)).catch(() => {});
    api.get<Educador[]>('/educadores').then(r => setEducadores(r.data)).catch(() => {});
  }, []);

  // When turma changes, set turma info and reset
  useEffect(() => {
    if (selectedTurmaId) {
      const t = turmas.find(t => t.id_turma === Number(selectedTurmaId));
      setSelectedTurma(t || null);
      if (t) {
        setPeriodo(t.periodo === 'Matutino' ? 'Manhã' : t.periodo === 'Vespertino' ? 'Tarde' : t.periodo === 'Noturno' ? 'Noite' : '');
        // If turma has educador, auto-set
        if (t.nome_educador) {
          const edu = educadores.find(e => e.nome === t.nome_educador);
          if (edu) setEducadorId(edu.id_educador);
        }
      }
    } else {
      setSelectedTurma(null);
      setAlunos([]);
      setResumo([]);
      setHasFreqData(false);
    }
  }, [selectedTurmaId, turmas, educadores]);

  // Load students and existing freq when tab 2 opens or turma/data change
  const loadAlunosFreq = useCallback(async () => {
    if (!selectedTurmaId || !dataAula) return;
    setLoadingAlunos(true);
      // Load students
      let studentList: Aluno[] = [];
      try {
        const { data } = await api.get<Aluno[]>(`/frequencias/turma/${selectedTurmaId}/alunos`);
        studentList = data;
      } catch {
        show('Erro ao carregar alunos da turma', 'error');
        setLoadingAlunos(false);
        return;
      }
      
      // Try to load existing frequency for this date
      let existing: { aula: AulaInfo | null; frequencias: any[] } = { aula: null, frequencias: [] };
      try {
        const { data } = await api.get<{ aula: AulaInfo | null; frequencias: any[] }>(
          `/frequencias/turma/${selectedTurmaId}/data/${dataAula}`
        );
        existing = data;
      } catch (err: any) {
        console.error('Aviso: Falha ao carregar frequências existentes. A tabela aula existe?', err);
        // Não interrompe o fluxo se a busca de frequências falhar
      }

      if (existing.aula) {
        setHasFreqData(true);
        if (existing.aula.periodo) setPeriodo(existing.aula.periodo);
        if (existing.aula.id_educador) setEducadorId(existing.aula.id_educador);
        if (existing.aula.conteudo_ministrado) setConteudo(existing.aula.conteudo_ministrado);
        if (existing.aula.observacoes_gerais) setObsGerais(existing.aula.observacoes_gerais);
      } else {
        setHasFreqData(false);
      }

      // Merge freq data with students
      const merged = studentList.map(s => {
        const freq = existing.frequencias.find((f: any) => f.id_matricula === s.id_matricula);
        return {
          ...s,
          presente: freq && freq.id ? Boolean(freq.presente) : true, // default to present
          justificativa: freq?.justificativa || '',
          observacao_individual: freq?.observacao_individual || '',
        };
      });

      setAlunos(merged);
      setLoadingAlunos(false);
  }, [selectedTurmaId, dataAula, show]);

  // Load when clicking the search button
  const handleBuscar = () => {
    if (!selectedTurmaId) { show('Selecione uma turma primeiro', 'error'); return; }
    loadAlunosFreq();
    setActiveTab(1);
  };

  // Load resumo for Tab 3
  const loadResumo = useCallback(async () => {
    if (!selectedTurmaId) return;
    setLoadingResumo(true);
    try {
      const { data } = await api.get<ResumoAluno[]>(`/frequencias/turma/${selectedTurmaId}/resumo`);
      setResumo(data);
    } catch {
      show('Erro ao carregar resumo', 'error');
    } finally {
      setLoadingResumo(false);
    }
  }, [selectedTurmaId, show]);

  useEffect(() => {
    if (activeTab === 2 && selectedTurmaId) loadResumo();
  }, [activeTab, selectedTurmaId, loadResumo]);

  // Save all frequencies
  const handleSave = async () => {
    if (!selectedTurmaId || alunos.length === 0) {
      show('Nenhum aluno para lançar frequência', 'error');
      return;
    }
    setSaving(true);
    try {
      await api.post('/frequencias/lancar', {
        id_turma: selectedTurmaId,
        data_aula: dataAula,
        periodo: periodo || null,
        id_educador: educadorId || null,
        conteudo_ministrado: conteudo || null,
        observacoes_gerais: obsGerais || null,
        frequencias: alunos.map(a => ({
          matricula_id: a.id_matricula,
          presente: a.presente,
          justificativa: a.justificativa || '',
          observacao_individual: a.observacao_individual || '',
        })),
      });
      show('Frequência salva com sucesso!');
      setHasFreqData(true);
    } catch (e: any) {
      show(e.response?.data?.message || 'Erro ao salvar frequência', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Toggle all present
  const toggleAll = (val: boolean) => {
    setAlunos(prev => prev.map(a => ({ ...a, presente: val })));
  };

  // Update individual aluno field
  const updateAluno = (idx: number, field: string, value: any) => {
    setAlunos(prev => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
  };

  // Computed stats
  const totalAlunos = alunos.length;
  const totalPresentes = alunos.filter(a => a.presente).length;
  const totalAusentes = totalAlunos - totalPresentes;
  const percentual = totalAlunos > 0 ? ((totalPresentes / totalAlunos) * 100).toFixed(1) : '0';

  // Tabs
  const tabs = [
    { icon: <BookOpen size={15} />, label: 'Identificação da Aula' },
    { icon: <ClipboardCheck size={15} />, label: 'Lista de Alunos' },
    { icon: <BarChart3 size={15} />, label: 'Resumo' },
  ];

  return (
    <div className="page-content">
      {/* Header */}
      <div className="freq-header">
        <div className="freq-header-left">
          <div className="freq-icon-wrap">
            <ClipboardCheck size={24} />
          </div>
          <div>
            <h2 className="freq-title">Lançamento de Frequência</h2>
            <p className="freq-subtitle">Registre a presença dos alunos por turma e data</p>
          </div>
        </div>
      </div>

      {/* Turma Selector Bar */}
      <div className="freq-selector-bar">
        <div className="freq-selector-group">
          <label>Turma</label>
          <select 
            value={selectedTurmaId} 
            onChange={e => setSelectedTurmaId(e.target.value ? Number(e.target.value) : '')}
            className="freq-select-turma"
          >
            <option value="">Selecione a turma...</option>
            {turmas.filter(t => t.ativo === 'S').map(t => (
              <option key={t.id_turma} value={t.id_turma}>
                {t.codigo_turma} — {t.nome_curso || 'Sem curso'}
              </option>
            ))}
          </select>
        </div>
        <div className="freq-selector-group">
          <label>Data da Aula</label>
          <input 
            type="date" 
            value={dataAula} 
            onChange={e => setDataAula(e.target.value)} 
          />
        </div>
        <button className="btn btn-primary freq-btn-buscar" onClick={handleBuscar} disabled={!selectedTurmaId}>
          <Search size={15} /> Buscar Alunos
        </button>
      </div>

      {/* Turma Info Banner */}
      {selectedTurma && (
        <div className="freq-turma-banner">
          <div className="freq-banner-item">
            <span className="freq-banner-label">Turma</span>
            <span className="freq-banner-value">{selectedTurma.codigo_turma}</span>
          </div>
          <div className="freq-banner-divider" />
          <div className="freq-banner-item">
            <span className="freq-banner-label">Curso</span>
            <span className="freq-banner-value">{selectedTurma.nome_curso || '—'}</span>
          </div>
          <div className="freq-banner-divider" />
          <div className="freq-banner-item">
            <span className="freq-banner-label">Período</span>
            <span className="freq-banner-value">{selectedTurma.periodo}</span>
          </div>
          <div className="freq-banner-divider" />
          <div className="freq-banner-item">
            <span className="freq-banner-label">Educador</span>
            <span className="freq-banner-value">{selectedTurma.nome_educador || '—'}</span>
          </div>
          <div className="freq-banner-divider" />
          <div className="freq-banner-item">
            <span className="freq-banner-label">Data</span>
            <span className="freq-banner-value">{new Date(dataAula + 'T12:00').toLocaleDateString('pt-BR')}</span>
          </div>
          {hasFreqData && (
            <>
              <div className="freq-banner-divider" />
              <div className="freq-banner-item">
                <span className="badge badge-green">✓ Frequência já lançada</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Tab bar */}
      {selectedTurma && alunos.length > 0 && (
        <div className={`freq-workspace ${isFullscreen ? 'freq-fullscreen' : ''}`}>
          <div className="freq-tabs">
            {tabs.map((tab, i) => (
              <button
                key={i}
                className={`freq-tab ${activeTab === i ? 'active' : ''}`}
                onClick={() => setActiveTab(i as 0 | 1 | 2)}
              >
                {tab.icon}
                {tab.label}
                {i < 2 && <ChevronRight size={12} className="freq-tab-arrow" />}
              </button>
            ))}
          </div>

          {/* Tab 0 – Identificação da Aula */}
          {activeTab === 0 && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">Dados da Aula</span>
              </div>
              <div className="card-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Período</label>
                    <select value={periodo} onChange={e => setPeriodo(e.target.value)}>
                      <option value="">Selecione</option>
                      <option value="Manhã">Manhã</option>
                      <option value="Tarde">Tarde</option>
                      <option value="Noite">Noite</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Professor / Educador</label>
                    <select value={educadorId} onChange={e => setEducadorId(e.target.value ? Number(e.target.value) : '')}>
                      <option value="">Selecione</option>
                      {educadores.map(e => (
                        <option key={e.id_educador} value={e.id_educador}>{e.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group span-2">
                    <label>Conteúdo Ministrado</label>
                    <textarea 
                      value={conteudo} 
                      onChange={e => setConteudo(e.target.value)} 
                      placeholder="Resumo do conteúdo da aula..."
                      rows={3}
                    />
                  </div>
                  <div className="form-group span-2">
                    <label>Observações Gerais</label>
                    <textarea 
                      value={obsGerais} 
                      onChange={e => setObsGerais(e.target.value)} 
                      placeholder="Recados ou observações importantes..."
                      rows={2}
                    />
                  </div>
                </div>
                <div style={{ marginTop: 20, textAlign: 'right' }}>
                  <button className="btn btn-primary" onClick={() => setActiveTab(1)}>
                    Avançar para Lista de Alunos <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 1 – Grid de Alunos */}
          {activeTab === 1 && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <Users size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  Lista de Presença — {totalAlunos} alunos
                </span>
                <div className="toolbar">
                  <button className="btn btn-sm btn-success" onClick={() => toggleAll(true)} title="Marcar todos como presentes">
                    ✓ Todos Presentes
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => toggleAll(false)} title="Marcar todos como ausentes">
                    ✗ Todos Ausentes
                  </button>
                  <div style={{ width: 1, height: 20, background: 'var(--neutral-3)', margin: '0 8px' }} />
                  <button className="btn btn-ghost btn-sm" onClick={() => setIsFullscreen(!isFullscreen)} title={isFullscreen ? "Minimizar" : "Expandir para tela cheia"}>
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={() => { setIsFullscreen(false); setActiveTab(0); }} title="Fechar lista e voltar">
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="freq-grid-wrap">
                {loadingAlunos ? (
                  <div className="loading"><div className="spinner" /></div>
                ) : (
                  <table className="freq-table">
                    <thead>
                      <tr>
                        <th style={{ width: 40 }}>#</th>
                        <th style={{ width: 110 }}>Matrícula</th>
                        <th>Aluno</th>
                        <th style={{ width: 100, textAlign: 'center' }}>Presente</th>
                        <th style={{ width: 200 }}>Justificativa</th>
                        <th style={{ width: 180 }}>Observação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alunos.map((a, i) => (
                        <tr key={a.id_matricula} className={a.presente ? '' : 'freq-row-absent'}>
                          <td className="freq-row-num">{i + 1}</td>
                          <td>
                            <span className="badge badge-blue">{a.matricula_aluno}</span>
                          </td>
                          <td className="freq-nome">{a.nome_completo}</td>
                          <td style={{ textAlign: 'center' }}>
                            <label className="freq-toggle">
                              <input
                                type="checkbox"
                                checked={!!a.presente}
                                onChange={e => updateAluno(i, 'presente', e.target.checked)}
                              />
                              <span className="freq-toggle-slider" />
                            </label>
                          </td>
                          <td>
                            {!a.presente && (
                              <input
                                type="text"
                                className="freq-inline-input"
                                placeholder="Motivo da falta..."
                                value={a.justificativa || ''}
                                onChange={e => updateAluno(i, 'justificativa', e.target.value)}
                              />
                            )}
                          </td>
                          <td>
                            <input
                              type="text"
                              className="freq-inline-input"
                              placeholder="Obs..."
                              value={a.observacao_individual || ''}
                              onChange={e => updateAluno(i, 'observacao_individual', e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Quick stats bar */}
              <div className="freq-quick-stats">
                <div className="freq-qs-item">
                  <Users size={14} />
                  <span>Total: <strong>{totalAlunos}</strong></span>
                </div>
                <div className="freq-qs-item green">
                  <span>Presentes: <strong>{totalPresentes}</strong></span>
                </div>
                <div className="freq-qs-item red">
                  <span>Ausentes: <strong>{totalAusentes}</strong></span>
                </div>
                <div className="freq-qs-item blue">
                  <span>Frequência: <strong>{percentual}%</strong></span>
                </div>
                <div style={{ flex: 1 }} />
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  <Save size={14} /> {saving ? 'Salvando...' : 'Salvar Frequência'}
                </button>
              </div>
            </div>
          )}

          {/* Tab 2 – Resumo */}
          {activeTab === 2 && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">
                  <BarChart3 size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  Resumo de Frequência — Turma {selectedTurma?.codigo_turma}
                </span>
                <button className="btn btn-outline btn-sm" onClick={() => window.print()}>
                  <Printer size={13} /> Imprimir
                </button>
              </div>

              {/* Summary cards */}
              <div className="freq-summary-cards">
                <div className="freq-summary-card">
                  <div className="freq-sc-label">Total de Alunos</div>
                  <div className="freq-sc-value">{resumo.length}</div>
                </div>
                <div className="freq-summary-card green">
                  <div className="freq-sc-label">Média de Presença</div>
                  <div className="freq-sc-value">
                    {resumo.length > 0 
                      ? (resumo.reduce((acc, r) => acc + (r.total_aulas_lancadas > 0 ? (r.total_presencas / r.total_aulas_lancadas) * 100 : 0), 0) / resumo.length).toFixed(1) + '%'
                      : '—'}
                  </div>
                </div>
                <div className="freq-summary-card red">
                  <div className="freq-sc-label">Total de Faltas</div>
                  <div className="freq-sc-value">{resumo.reduce((acc, r) => acc + r.total_faltas, 0)}</div>
                </div>
                <div className="freq-summary-card blue">
                  <div className="freq-sc-label">Aulas Lançadas</div>
                  <div className="freq-sc-value">{resumo.length > 0 ? resumo[0].total_aulas_lancadas : 0}</div>
                </div>
              </div>

              {loadingResumo ? (
                <div className="loading"><div className="spinner" /></div>
              ) : resumo.length === 0 ? (
                <div className="empty-state">
                  <BarChart3 size={40} />
                  <p>Nenhum dado de frequência registrado para esta turma.</p>
                </div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Matrícula</th>
                        <th>Aluno</th>
                        <th style={{ textAlign: 'center' }}>Aulas</th>
                        <th style={{ textAlign: 'center' }}>Presenças</th>
                        <th style={{ textAlign: 'center' }}>Faltas</th>
                        <th style={{ textAlign: 'center' }}>Frequência %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resumo.map((r, i) => {
                        const perc = r.total_aulas_lancadas > 0
                          ? ((r.total_presencas / r.total_aulas_lancadas) * 100).toFixed(1)
                          : '—';
                        const percNum = r.total_aulas_lancadas > 0 ? (r.total_presencas / r.total_aulas_lancadas) * 100 : 100;
                        return (
                          <tr key={i}>
                            <td><span className="badge badge-blue">{r.matricula_aluno}</span></td>
                            <td style={{ fontWeight: 600 }}>{r.nome_completo}</td>
                            <td style={{ textAlign: 'center' }}>{r.total_aulas_lancadas}</td>
                            <td style={{ textAlign: 'center', color: 'var(--green)', fontWeight: 600 }}>{r.total_presencas}</td>
                            <td style={{ textAlign: 'center', color: r.total_faltas > 0 ? 'var(--red)' : 'inherit', fontWeight: r.total_faltas > 0 ? 600 : 400 }}>{r.total_faltas}</td>
                            <td style={{ textAlign: 'center' }}>
                              <div className="freq-percent-bar">
                                <div className="freq-percent-fill" style={{ width: `${Math.min(percNum, 100)}%`, background: percNum >= 75 ? 'var(--green)' : percNum >= 50 ? 'var(--yellow)' : 'var(--red)' }} />
                              </div>
                              <span className="freq-percent-text" style={{ color: percNum >= 75 ? 'var(--green)' : percNum >= 50 ? 'var(--yellow)' : 'var(--red)' }}>
                                {perc}{perc !== '—' ? '%' : ''}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty state when no turma or no search yet */}
      {(!selectedTurma || alunos.length === 0) && !loadingAlunos && (
        <div className="card" style={{ padding: 48 }}>
          <div className="empty-state">
            <Calendar size={48} />
            <h3 style={{ color: 'var(--neutral-7)', margin: '8px 0 4px' }}>Selecione uma turma e data</h3>
            <p>Escolha a turma e a data da aula acima, depois clique em <strong>"Buscar Alunos"</strong> para iniciar o lançamento de frequência.</p>
          </div>
        </div>
      )}
    </div>
  );
}
