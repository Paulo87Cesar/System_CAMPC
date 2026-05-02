<?php
/** Módulo: View - Matrículas por Jovem (somente leitura) */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/crud_helper.php';

renderViewGrid([
    'mod' => 'vw_matriculas_jovem',
    'view' => 'vw_matriculas_jovem',
    'grid_columns' => [
        'nome_jovem' => 'Jovem',
        'matricula_jovem' => 'Matrícula',
        'nome_projeto' => 'Projeto',
        'nome_programa' => 'Programa',
        'nome_curso' => 'Curso',
        'codigo_turma' => 'Turma',
        'periodo' => 'Período',
        'data_inicio' => 'Início',
        'data_fim' => 'Fim',
        'data_matricula' => 'Data Matrícula',
        'status_matricula' => 'Status',
        'educador' => 'Educador',
    ],
    'badge_fields' => [
        'status_matricula' => [
            'Cursando' => 'badge-info',
            'Concluído' => 'badge-success',
            'Desistente' => 'badge-danger',
            'Reprovado' => 'badge-danger',
            'Transferido' => 'badge-warning',
        ],
    ],
]);
