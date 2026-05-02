<?php
/** Módulo: Educador */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/crud_helper.php';

renderCrud([
    'mod' => 'educador',
    'table' => 'educador',
    'pk' => 'id_educador',
    'singular' => 'Educador',
    'plural' => 'Educadores',
    'columns' => ['nome','email','cpf','telefone','especialidade','ativo'],
    'searchable' => ['nome','email','cpf','especialidade'],
    'grid_columns' => [
        'id_educador' => 'ID',
        'nome' => 'Nome',
        'email' => 'E-mail',
        'cpf' => 'CPF',
        'especialidade' => 'Especialidade',
        'ativo' => 'Ativo',
    ],
    'grid_columns_keys' => ['nome'],
    'badge_fields' => [
        'ativo' => ['S' => 'badge-success', 'N' => 'badge-danger'],
    ],
    'fields' => [
        ['name'=>'nome', 'label'=>'Nome Completo', 'required'=>true],
        ['name'=>'email', 'label'=>'E-mail', 'type'=>'email'],
        ['name'=>'cpf', 'label'=>'CPF'],
        ['name'=>'telefone', 'label'=>'Telefone'],
        ['name'=>'especialidade', 'label'=>'Especialidade'],
        ['name'=>'ativo', 'label'=>'Ativo', 'type'=>'select', 'options'=>['S'=>'Sim','N'=>'Não'], 'default'=>'S'],
    ],
]);
