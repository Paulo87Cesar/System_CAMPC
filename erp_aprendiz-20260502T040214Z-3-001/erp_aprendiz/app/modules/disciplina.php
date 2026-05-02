<?php
/** Módulo: Disciplina */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/crud_helper.php';

renderCrud([
    'mod' => 'disciplina',
    'table' => 'disciplina',
    'pk' => 'id_disciplina',
    'singular' => 'Disciplina',
    'plural' => 'Disciplinas',
    'columns' => ['id_curso','nome_disciplina','descricao','carga_horaria_horas','carga_horaria_minutos','ordem','ativo'],
    'searchable' => ['nome_disciplina','descricao'],
    'grid_columns' => [
        'id_disciplina' => 'ID',
        'nome_disciplina' => 'Disciplina',
        'id_curso' => 'Curso (ID)',
        'ordem' => 'Ordem',
        'carga_horaria_horas' => 'CH (h)',
        'ativo' => 'Ativo',
    ],
    'grid_columns_keys' => ['nome_disciplina'],
    'badge_fields' => [
        'ativo' => ['S' => 'badge-success', 'N' => 'badge-danger'],
    ],
    'fields' => [
        ['name'=>'id_curso', 'label'=>'Curso', 'type'=>'select', 'required'=>true, 'lookup'=>['table'=>'curso','key'=>'id_curso','label'=>'nome_curso']],
        ['name'=>'nome_disciplina', 'label'=>'Nome da Disciplina', 'required'=>true],
        ['name'=>'ordem', 'label'=>'Ordem (Encontro)', 'type'=>'number', 'default'=>'1'],
        ['name'=>'carga_horaria_horas', 'label'=>'CH (horas)', 'type'=>'number', 'default'=>'0'],
        ['name'=>'carga_horaria_minutos', 'label'=>'CH (minutos)', 'type'=>'number', 'default'=>'0'],
        ['name'=>'ativo', 'label'=>'Ativo', 'type'=>'select', 'options'=>['S'=>'Sim','N'=>'Não'], 'default'=>'S'],
        ['name'=>'descricao', 'label'=>'Descrição', 'type'=>'textarea', 'span'=>'2'],
    ],
]);
