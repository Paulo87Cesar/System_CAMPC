<?php
/**
 * ERP Jovem Aprendiz — Configuração Geral
 */

define('APP_NAME', 'ERP Jovem Aprendiz');
define('APP_VERSION', '2.0');
define('APP_ORG', 'Patrulheiros Campinas');
define('APP_BASE_URL', '/erp_aprendiz/app');

// Timezone
date_default_timezone_set('America/Sao_Paulo');

// Session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Autoload das configurações
require_once __DIR__ . '/database.php';

/**
 * Definição dos módulos do sistema (menu)
 */
function getModules(): array {
    return [
        'dashboard' => [
            'label' => 'Dashboard',
            'icon'  => 'fas fa-tachometer-alt',
            'file'  => 'dashboard.php',
        ],
        'inscricoes' => [
            'label'    => 'Inscrições',
            'icon'     => 'fas fa-file-signature',
            'children' => [
                'inscricao_2026'    => ['label' => 'Inscrições 2026', 'icon' => 'fas fa-clipboard-list'],
                'inscricao_familia' => ['label' => 'Núcleo Familiar', 'icon' => 'fas fa-users'],
            ],
        ],
        'cadastros' => [
            'label'    => 'Cadastros',
            'icon'     => 'fas fa-address-card',
            'children' => [
                'cadastro_jovem' => ['label' => 'Jovens Aprendizes', 'icon' => 'fas fa-user-graduate'],
                'educador'       => ['label' => 'Educadores', 'icon' => 'fas fa-chalkboard-teacher'],
            ],
        ],
        'academico' => [
            'label'    => 'Acadêmico',
            'icon'     => 'fas fa-graduation-cap',
            'children' => [
                'projeto'     => ['label' => 'Projetos', 'icon' => 'fas fa-project-diagram'],
                'programa'    => ['label' => 'Programas', 'icon' => 'fas fa-layer-group'],
                'curso'       => ['label' => 'Cursos', 'icon' => 'fas fa-book'],
                'disciplina'  => ['label' => 'Disciplinas', 'icon' => 'fas fa-book-open'],
                'turma'       => ['label' => 'Turmas', 'icon' => 'fas fa-chalkboard'],
            ],
        ],
        'operacional' => [
            'label'    => 'Operacional',
            'icon'     => 'fas fa-cogs',
            'children' => [
                'matricula_turma' => ['label' => 'Matrículas', 'icon' => 'fas fa-user-check'],
                'boletim_nota'    => ['label' => 'Boletim / Notas', 'icon' => 'fas fa-poll'],
            ],
        ],
        'relatorios' => [
            'label'    => 'Relatórios',
            'icon'     => 'fas fa-chart-bar',
            'children' => [
                'vw_boletim_jovem'    => ['label' => 'Boletim Completo', 'icon' => 'fas fa-file-alt'],
                'vw_matriculas_jovem' => ['label' => 'Matrículas por Jovem', 'icon' => 'fas fa-list-alt'],
            ],
        ],
    ];
}
