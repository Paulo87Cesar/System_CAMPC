import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import JovensPage from './pages/Jovens';
import InscricoesPage from './pages/Inscricoes';
import EducadoresPage from './pages/Educadores';
import ProjetosPage from './pages/Projetos';
import ProgramasPage from './pages/Programas';
import CursosPage from './pages/Cursos';
import DisciplinasPage from './pages/Disciplinas';
import TurmasPage from './pages/Turmas';
import MatriculasPage from './pages/Matriculas';
import BoletimPage from './pages/Boletim';
import EmpresasPage from './pages/Empresas';
import ContratosPage from './pages/Contratos';

// --- Phase 1 ---
import FrequenciasPage from './pages/Frequencias';
import OcorrenciasPage from './pages/Ocorrencias';
import SocialAtendimentosPage from './pages/SocialAtendimentos';
import UsuariosPage from './pages/Usuarios';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!user) return <Login />;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jovens" element={<JovensPage />} />
          <Route path="/inscricoes" element={<InscricoesPage />} />
          <Route path="/educadores" element={<EducadoresPage />} />
          <Route path="/projetos" element={<ProjetosPage />} />
          <Route path="/programas" element={<ProgramasPage />} />
          <Route path="/cursos" element={<CursosPage />} />
          <Route path="/disciplinas" element={<DisciplinasPage />} />
          <Route path="/turmas" element={<TurmasPage />} />
          <Route path="/matriculas" element={<MatriculasPage />} />
          <Route path="/boletim" element={<BoletimPage />} />
          <Route path="/empresas" element={<EmpresasPage />} />
          <Route path="/contratos" element={<ContratosPage />} />
          
          {/* Phase 1 */}
          <Route path="/frequencias" element={<FrequenciasPage />} />
          <Route path="/ocorrencias" element={<OcorrenciasPage />} />
          <Route path="/social" element={<SocialAtendimentosPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
        </Routes>
      </div>
    </div>
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
