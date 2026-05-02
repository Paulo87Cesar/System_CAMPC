<?php
/** Módulo: Curso */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/crud_helper.php';

renderCrud([
    'mod' => 'curso',
    'table' => 'curso',
    'pk' => 'id_curso',
    'singular' => 'Curso',
    'plural' => 'Cursos',
    'columns' => ['id_programa','nome_curso','descricao','conteudo','carga_horaria_horas','carga_horaria_minutos','ativo'],
    'searchable' => ['nome_curso','descricao','conteudo'],
    'grid_columns' => [
        'id_curso' => 'ID',
        'nome_curso' => 'Nome do Curso',
        'id_programa' => 'Programa (ID)',
        'carga_horaria_horas' => 'CH (h)',
        'carga_horaria_minutos' => 'CH (min)',
        'ativo' => 'Ativo',
    ],
    'grid_columns_keys' => ['nome_curso'],
    'badge_fields' => [
        'ativo' => ['S' => 'badge-success', 'N' => 'badge-danger'],
    ],
    'fields' => [
        ['name'=>'id_programa', 'label'=>'Programa', 'type'=>'select', 'required'=>true, 'lookup'=>['table'=>'programa','key'=>'id_programa','label'=>'nome_programa']],
        ['name'=>'nome_curso', 'label'=>'Nome do Curso', 'required'=>true],
        ['name'=>'carga_horaria_horas', 'label'=>'Carga Horária (h)', 'type'=>'number', 'default'=>'0'],
        ['name'=>'carga_horaria_minutos', 'label'=>'CH Minutos', 'type'=>'number', 'default'=>'0'],
        ['name'=>'ativo', 'label'=>'Ativo', 'type'=>'select', 'options'=>['S'=>'Sim','N'=>'Não'], 'default'=>'S'],
        ['name'=>'descricao', 'label'=>'Descrição', 'type'=>'textarea'],
        ['name'=>'conteudo', 'label'=>'Conteúdo Programático', 'type'=>'textarea', 'span'=>'2'],
    ],
]);
