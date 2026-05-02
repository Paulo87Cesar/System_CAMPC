<?php
/** Módulo: Núcleo Familiar (Inscrição) */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/crud_helper.php';

renderCrud([
    'mod' => 'inscricao_familia',
    'table' => 'inscricao_familia',
    'pk' => 'id',
    'singular' => 'Familiar',
    'plural' => 'Núcleo Familiar',
    'columns' => ['id_inscricao','parentesco','nome_parente','cpf_parente','salario_parente'],
    'searchable' => ['nome_parente','cpf_parente','parentesco'],
    'grid_columns' => [
        'id' => 'ID',
        'id_inscricao' => 'Inscrição (ID)',
        'parentesco' => 'Parentesco',
        'nome_parente' => 'Nome',
        'cpf_parente' => 'CPF',
        'salario_parente' => 'Salário',
    ],
    'grid_columns_keys' => ['nome_parente'],
    'badge_fields' => [],
    'fields' => [
        ['name'=>'id_inscricao', 'label'=>'Inscrição', 'type'=>'select', 'required'=>true, 'lookup'=>['table'=>'inscricao_2026','key'=>'id','label'=>'nome_completo']],
        ['name'=>'parentesco', 'label'=>'Parentesco', 'type'=>'select', 'options'=>['Mãe'=>'Mãe','Pai'=>'Pai','Avó'=>'Avó','Avô'=>'Avô','Irmão(ã)'=>'Irmão(ã)','Tio(a)'=>'Tio(a)','Outro'=>'Outro']],
        ['name'=>'nome_parente', 'label'=>'Nome do Parente', 'required'=>true],
        ['name'=>'cpf_parente', 'label'=>'CPF do Parente'],
        ['name'=>'salario_parente', 'label'=>'Salário (R$)', 'type'=>'number'],
    ],
]);
