<?php
/** Módulo: Projeto */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/crud_helper.php';

renderCrud([
    'mod' => 'projeto',
    'table' => 'projeto',
    'pk' => 'id_projeto',
    'singular' => 'Projeto',
    'plural' => 'Projetos',
    'columns' => ['nome_projeto','descricao','data_inicio','data_fim','ativo'],
    'searchable' => ['nome_projeto','descricao'],
    'grid_columns' => [
        'id_projeto' => 'ID',
        'nome_projeto' => 'Nome do Projeto',
        'data_inicio' => 'Início',
        'data_fim' => 'Fim',
        'ativo' => 'Ativo',
    ],
    'grid_columns_keys' => ['nome_projeto'],
    'badge_fields' => [
        'ativo' => ['S' => 'badge-success', 'N' => 'badge-danger'],
    ],
    'fields' => [
        ['name'=>'nome_projeto', 'label'=>'Nome do Projeto', 'required'=>true],
        ['name'=>'ativo', 'label'=>'Ativo', 'type'=>'select', 'options'=>['S'=>'Sim','N'=>'Não'], 'default'=>'S'],
        ['name'=>'data_inicio', 'label'=>'Data Início', 'type'=>'date'],
        ['name'=>'data_fim', 'label'=>'Data Fim', 'type'=>'date'],
        ['name'=>'descricao', 'label'=>'Descrição', 'type'=>'textarea', 'span'=>'2'],
    ],
]);
