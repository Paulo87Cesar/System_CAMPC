<?php
/** Módulo: Turma */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/crud_helper.php';

renderCrud([
    'mod' => 'turma',
    'table' => 'turma',
    'pk' => 'id_turma',
    'singular' => 'Turma',
    'plural' => 'Turmas',
    'columns' => ['id_curso','id_educador','codigo_turma','periodo','data_inicio','data_fim','vagas','local','ativo'],
    'searchable' => ['codigo_turma','local','periodo'],
    'grid_columns' => [
        'id_turma' => 'ID',
        'codigo_turma' => 'Código',
        'id_curso' => 'Curso (ID)',
        'periodo' => 'Período',
        'data_inicio' => 'Início',
        'data_fim' => 'Fim',
        'vagas' => 'Vagas',
        'ativo' => 'Ativo',
    ],
    'grid_columns_keys' => ['codigo_turma'],
    'badge_fields' => [
        'ativo' => ['S' => 'badge-success', 'N' => 'badge-danger'],
    ],
    'fields' => [
        ['name'=>'codigo_turma', 'label'=>'Código da Turma', 'required'=>true],
        ['name'=>'id_curso', 'label'=>'Curso', 'type'=>'select', 'required'=>true, 'lookup'=>['table'=>'curso','key'=>'id_curso','label'=>'nome_curso']],
        ['name'=>'id_educador', 'label'=>'Educador', 'type'=>'select', 'lookup'=>['table'=>'educador','key'=>'id_educador','label'=>'nome']],
        ['name'=>'periodo', 'label'=>'Período', 'type'=>'select', 'options'=>['Matutino'=>'Matutino','Vespertino'=>'Vespertino','Noturno'=>'Noturno','Integral'=>'Integral'], 'default'=>'Matutino'],
        ['name'=>'data_inicio', 'label'=>'Data Início', 'type'=>'date'],
        ['name'=>'data_fim', 'label'=>'Data Fim', 'type'=>'date'],
        ['name'=>'vagas', 'label'=>'Vagas', 'type'=>'number'],
        ['name'=>'local', 'label'=>'Local'],
        ['name'=>'ativo', 'label'=>'Ativo', 'type'=>'select', 'options'=>['S'=>'Sim','N'=>'Não'], 'default'=>'S'],
    ],
]);
