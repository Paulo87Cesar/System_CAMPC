import React from 'react';
import { useLocation } from 'react-router-dom';

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/jovens': 'Jovens',
  '/inscricoes': 'Inscrições',
  '/educadores': 'Educadores',
  '/projetos': 'Projetos',
  '/programas': 'Programas',
  '/cursos': 'Cursos',
  '/disciplinas': 'Disciplinas',
  '/turmas': 'Turmas',
  '/matriculas': 'Matrículas',
  '/boletim': 'Boletins',
};

export default function Topbar() {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? 'ERP';
  const initials = 'PC';

  return (
    <header className="topbar">
      <h1 className="topbar-title">{title}</h1>
      <span className="topbar-badge">Jovem Aprendiz</span>
      <div className="topbar-avatar" title="Paulo Cesar">{initials}</div>
    </header>
  );
}
