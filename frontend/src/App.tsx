import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import LoginSuccess from './pages/LoginSuccess';

import Dashboard from './pages/Dashboard';
import JovensPage from './pages/Jovens';
import JovemHistorico from './pages/JovemHistorico';
import InscricoesPage from './pages/Inscricoes';
import EducadoresPage from './pages/Educadores';
import ProjetosPage from './pages/Projetos';
import ProjetoIndicadores from './pages/ProjetoIndicadores';
import ProjetoRelatorio from './pages/ProjetoRelatorio';
import ProjetoRelatorioFullscreen from './pages/ProjetoRelatorioFullscreen';
import ProgramasPage from './pages/Programas';
import CursosPage from './pages/Cursos';
import DisciplinasPage from './pages/Disciplinas';
import TurmasPage from './pages/Turmas';
import TurmaDiario from './pages/TurmaDiario';
import MatriculasPage from './pages/Matriculas';
import BoletimPage from './pages/Boletim';
import EmpresasPage from './pages/Empresas';
import ContratosPage from './pages/Contratos';

// --- Phase 1 ---
import FrequenciasPage from './pages/Frequencias';
import OcorrenciasPage from './pages/Ocorrencias';
import SocialAtendimentosPage from './pages/SocialAtendimentos';
import UsuariosPage from './pages/Usuarios';

// --- Phase 2 ---
import FolhaPagamentoPage from './pages/FolhaPagamento';
import FaturasPage from './pages/Faturas';
import ContratosEstagioPage from './pages/ContratosEstagio';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  
  return (
    <Routes>
      <Route path="/login-success" element={<LoginSuccess />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="*" 
        element={!user ? <Login /> : (
          <div className="app-layout">
            <Sidebar />
            <div className="main-area">
              <Topbar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/jovens" element={<JovensPage />} />
                <Route path="/jovens/:id/historico" element={<JovemHistorico />} />
                <Route path="/inscricoes" element={<InscricoesPage />} />
                <Route path="/educadores" element={<EducadoresPage />} />
                <Route path="/projetos" element={<ProjetosPage />} />
                <Route path="/projetos/:id/indicadores" element={<ProjetoIndicadores />} />
                <Route path="/projetos/:id/relatorio" element={<ProjetoRelatorio />} />
                <Route path="/projetos/:id/relatorio-tela-cheia" element={<ProjetoRelatorioFullscreen />} />
                <Route path="/programas" element={<ProgramasPage />} />
                <Route path="/cursos" element={<CursosPage />} />
                <Route path="/disciplinas" element={<DisciplinasPage />} />
                <Route path="/turmas" element={<TurmasPage />} />
                <Route path="/turmas/:id/diario" element={<TurmaDiario />} />
                <Route path="/matriculas" element={<MatriculasPage />} />
                <Route path="/boletim" element={<BoletimPage />} />
                <Route path="/empresas" element={<EmpresasPage />} />
                <Route path="/contratos" element={<ContratosPage />} />
                
                {/* Phase 1 */}
                <Route path="/frequencias" element={<FrequenciasPage />} />
                <Route path="/ocorrencias" element={<OcorrenciasPage />} />
                <Route path="/social" element={<SocialAtendimentosPage />} />
                <Route path="/usuarios" element={<UsuariosPage />} />
      
                {/* Phase 2 */}
                <Route path="/folha_pagamento" element={<FolhaPagamentoPage />} />
                <Route path="/faturas" element={<FaturasPage />} />
                <Route path="/contratos_estagio" element={<ContratosEstagioPage />} />
              </Routes>
            </div>
          </div>
        )} 
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
