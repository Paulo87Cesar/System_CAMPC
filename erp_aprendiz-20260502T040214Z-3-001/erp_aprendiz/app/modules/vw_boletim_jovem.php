<?php
/** Módulo: View - Boletim Completo por Jovem (somente leitura) */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/crud_helper.php';

renderViewGrid([
    'mod' => 'vw_boletim_jovem',
    'view' => 'vw_boletim_jovem',
    'grid_columns' => [
        'nome_jovem' => 'Jovem',
        'matricula_jovem' => 'Matrícula',
        'nome_projeto' => 'Projeto',
        'nome_programa' => 'Programa',
        'nome_curso' => 'Curso',
        'codigo_turma' => 'Turma',
        'nome_disciplina' => 'Disciplina',
        'periodo_avaliacao' => 'Período',
        'nota' => 'Nota',
        'faltas' => 'Faltas',
        'presencas' => 'Presenças',
        'status_matricula' => 'Status',
        'educador' => 'Educador',
    ],
    'badge_fields' => [
        'status_matricula' => [
            'Cursando' => 'badge-info',
            'Concluído' => 'badge-success',
            'Desistente' => 'badge-danger',
            'Reprovado' => 'badge-danger',
        ],
    ],
]);
