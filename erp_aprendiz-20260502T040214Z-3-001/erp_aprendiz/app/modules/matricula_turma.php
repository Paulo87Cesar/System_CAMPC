<?php
/** Módulo: Matrícula em Turma */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/crud_helper.php';

renderCrud([
    'mod' => 'matricula_turma',
    'table' => 'matricula_turma',
    'pk' => 'id_matricula',
    'singular' => 'Matrícula',
    'plural' => 'Matrículas',
    'columns' => ['id_jovem','id_turma','data_matricula','status_matricula','observacoes'],
    'searchable' => ['status_matricula','observacoes'],
    'grid_columns' => [
        'id_matricula' => 'ID',
        'id_jovem' => 'Jovem (ID)',
        'id_turma' => 'Turma (ID)',
        'data_matricula' => 'Data Matrícula',
        'status_matricula' => 'Status',
    ],
    'grid_columns_keys' => ['id_jovem'],
    'badge_fields' => [
        'status_matricula' => [
            'Cursando' => 'badge-info',
            'Concluído' => 'badge-success',
            'Desistente' => 'badge-danger',
            'Reprovado' => 'badge-danger',
            'Transferido' => 'badge-warning',
        ],
    ],
    'fields' => [
        ['name'=>'id_jovem', 'label'=>'Jovem', 'type'=>'select', 'required'=>true, 'lookup'=>['table'=>'cadastro_jovem','key'=>'id_jovem','label'=>'nome_completo']],
        ['name'=>'id_turma', 'label'=>'Turma', 'type'=>'select', 'required'=>true, 'lookup'=>['table'=>'turma','key'=>'id_turma','label'=>'codigo_turma']],
        ['name'=>'data_matricula', 'label'=>'Data da Matrícula', 'type'=>'date', 'required'=>true],
        ['name'=>'status_matricula', 'label'=>'Status', 'type'=>'select', 'options'=>['Cursando'=>'Cursando','Concluído'=>'Concluído','Desistente'=>'Desistente','Reprovado'=>'Reprovado','Transferido'=>'Transferido'], 'default'=>'Cursando'],
        ['name'=>'observacoes', 'label'=>'Observações', 'type'=>'textarea', 'span'=>'2'],
    ],
]);
