<?php
/** Módulo: Boletim / Notas */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/crud_helper.php';

renderCrud([
    'mod' => 'boletim_nota',
    'table' => 'boletim_nota',
    'pk' => 'id_nota',
    'singular' => 'Nota',
    'plural' => 'Notas',
    'columns' => ['id_matricula','id_disciplina','periodo_avaliacao','nota','faltas','presencas','observacoes'],
    'searchable' => ['periodo_avaliacao','observacoes'],
    'grid_columns' => [
        'id_nota' => 'ID',
        'id_matricula' => 'Matrícula (ID)',
        'id_disciplina' => 'Disciplina (ID)',
        'periodo_avaliacao' => 'Período',
        'nota' => 'Nota',
        'faltas' => 'Faltas',
        'presencas' => 'Presenças',
    ],
    'grid_columns_keys' => ['periodo_avaliacao'],
    'badge_fields' => [],
    'fields' => [
        ['name'=>'id_matricula', 'label'=>'Matrícula', 'type'=>'select', 'required'=>true, 'lookup'=>['table'=>'matricula_turma','key'=>'id_matricula','label'=>'id_matricula']],
        ['name'=>'id_disciplina', 'label'=>'Disciplina', 'type'=>'select', 'required'=>true, 'lookup'=>['table'=>'disciplina','key'=>'id_disciplina','label'=>'nome_disciplina']],
        ['name'=>'periodo_avaliacao', 'label'=>'Período de Avaliação'],
        ['name'=>'nota', 'label'=>'Nota (0-10)', 'type'=>'number'],
        ['name'=>'faltas', 'label'=>'Faltas', 'type'=>'number', 'default'=>'0'],
        ['name'=>'presencas', 'label'=>'Presenças', 'type'=>'number', 'default'=>'0'],
        ['name'=>'observacoes', 'label'=>'Observações', 'type'=>'textarea', 'span'=>'2'],
    ],
]);
