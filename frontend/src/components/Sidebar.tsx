import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, ClipboardList, GraduationCap,
  BookOpen, Layers, Calendar, Award, BookMarked, FileText,
  LogOut, Building2, Handshake, CheckSquare, AlertTriangle, HeartHandshake, Settings,
  Banknote, Receipt
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { section: 'Pessoas' },
  { label: 'Jovens', icon: Users, to: '/jovens' },
  { label: 'Inscrições', icon: ClipboardList, to: '/inscricoes' },
  { label: 'Educadores', icon: GraduationCap, to: '/educadores' },
  { section: 'Empresas' },
  { label: 'Parceiras', icon: Building2, to: '/empresas' },
  { label: 'Contratos (Aprendiz)', icon: Handshake, to: '/contratos' },
  { label: 'Contratos (Estágio)', icon: Handshake, to: '/contratos_estagio' },
  { section: 'Acadêmico' },
  { label: 'Projetos', icon: Layers, to: '/projetos' },
  { label: 'Programas', icon: BookMarked, to: '/programas' },
  { label: 'Cursos', icon: BookOpen, to: '/cursos' },
  { label: 'Disciplinas', icon: FileText, to: '/disciplinas' },
  { label: 'Turmas', icon: Calendar, to: '/turmas' },
  { section: 'Operacional Acadêmico' },
  { label: 'Matrículas', icon: Award, to: '/matriculas' },
  { label: 'Frequência', icon: CheckSquare, to: '/frequencias' },
  { label: 'Boletins', icon: FileText, to: '/boletim' },
  { label: 'Ocorrências', icon: AlertTriangle, to: '/ocorrencias' },
  { section: 'Serviço Social' },
  { label: 'Atendimentos', icon: HeartHandshake, to: '/social' },
  { section: 'Financeiro' },
  { label: 'Folha de Pagto.', icon: Banknote, to: '/folha_pagamento' },
  { label: 'Faturas', icon: Receipt, to: '/faturas' },
  { section: 'Configurações' },
  { label: 'Usuários', icon: Settings, to: '/usuarios' },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🎯</div>
        <div className="logo-text">
          <span className="logo-title">ERP Aprendiz</span>
          <span className="logo-sub">Patrulheiros Campinas</span>
        </div>
      </div>

      <div className="sidebar-nav">
        {navItems.map((item, i) => {
          if ('section' in item) {
            return <div key={i} className="nav-section-label">{item.section}</div>;
          }
          const Icon = item.icon!;
          return (
            <NavLink
              key={i}
              to={item.to!}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={16} />
              {item.label}
            </NavLink>
          );
        })}
      </div>

      <div className="sidebar-footer" style={{ padding: '20px 0', borderTop: '1px solid rgba(255,255,255,.1)' }}>
        <button className="nav-item" onClick={logout} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </nav>
  );
}
