<?php
/** Módulo: Programa */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/crud_helper.php';

renderCrud([
    'mod' => 'programa',
    'table' => 'programa',
    'pk' => 'id_programa',
    'singular' => 'Programa',
    'plural' => 'Programas',
    'columns' => ['id_projeto','nome_programa','descricao','ano','ativo'],
    'searchable' => ['nome_programa','descricao'],
    'grid_columns' => [
        'id_programa' => 'ID',
        'nome_programa' => 'Nome do Programa',
        'id_projeto' => 'Projeto (ID)',
        'ano' => 'Ano',
        'ativo' => 'Ativo',
    ],
    'grid_columns_keys' => ['nome_programa'],
    'badge_fields' => [
        'ativo' => ['S' => 'badge-success', 'N' => 'badge-danger'],
    ],
    'fields' => [
        ['name'=>'id_projeto', 'label'=>'Projeto', 'type'=>'select', 'required'=>true, 'lookup'=>['table'=>'projeto','key'=>'id_projeto','label'=>'nome_projeto']],
        ['name'=>'nome_programa', 'label'=>'Nome do Programa', 'required'=>true],
        ['name'=>'ano', 'label'=>'Ano', 'type'=>'number'],
        ['name'=>'ativo', 'label'=>'Ativo', 'type'=>'select', 'options'=>['S'=>'Sim','N'=>'Não'], 'default'=>'S'],
        ['name'=>'descricao', 'label'=>'Descrição', 'type'=>'textarea', 'span'=>'2'],
    ],
]);
