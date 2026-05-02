<?php
/** Módulo: Inscrições 2026 */
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../includes/crud_helper.php';

renderCrud([
    'mod' => 'inscricao_2026',
    'table' => 'inscricao_2026',
    'pk' => 'id',
    'singular' => 'Inscrição',
    'plural' => 'Inscrições 2026',
    'columns' => ['nome_completo','cpf','rg','nis','sexo','naturalidade','data_nascimento','estado_civil','cor_raca','destro_canhoto','socio_assistencial','ref_cras','is_deficiente','deficiencia_descricao','projeto','email','escola_status','escola_nome','escola_escolaridade','escola_periodo','escola_serie','escola_ra','end_cep','end_logradouro','end_numero','end_complemento','end_bairro','end_cidade','mora_com_pais','mora_com_quem','qtd_pessoas_residencia','tipo_moradia','tipo_construcao','ja_trabalhou','ctps_assinada','outras_rendas','telefone','tel_contato','tel_comercial','recebe_beneficio','beneficio_nome','beneficio_valor','status_processo'],
    'searchable' => ['nome_completo','cpf','email','end_cidade','projeto'],
    'grid_columns' => [
        'id' => 'ID',
        'nome_completo' => 'Nome',
        'cpf' => 'CPF',
        'projeto' => 'Projeto',
        'email' => 'E-mail',
        'status_processo' => 'Status',
        'data_cadastro' => 'Data',
    ],
    'grid_columns_keys' => ['nome_completo'],
    'badge_fields' => [
        'status_processo' => ['Aprovado' => 'badge-success', 'Pendente' => 'badge-warning', '1' => 'badge-warning', 'Reprovado' => 'badge-danger'],
    ],
    'fields' => [
        ['name'=>'nome_completo', 'label'=>'Nome Completo', 'required'=>true],
        ['name'=>'cpf', 'label'=>'CPF'],
        ['name'=>'rg', 'label'=>'RG'],
        ['name'=>'nis', 'label'=>'NIS/PIS'],
        ['name'=>'sexo', 'label'=>'Sexo', 'type'=>'select', 'options'=>['Masculino'=>'Masculino','Feminino'=>'Feminino']],
        ['name'=>'data_nascimento', 'label'=>'Data Nascimento', 'type'=>'date'],
        ['name'=>'estado_civil', 'label'=>'Estado Civil', 'type'=>'select', 'options'=>['Solteiro'=>'Solteiro','Casado'=>'Casado','Divorciado'=>'Divorciado','Viúvo'=>'Viúvo']],
        ['name'=>'cor_raca', 'label'=>'Cor/Raça', 'type'=>'select', 'options'=>['Branco'=>'Branco','Negro'=>'Negro','Pardo'=>'Pardo','Amarelo'=>'Amarelo','Indígena'=>'Indígena']],
        ['name'=>'email', 'label'=>'E-mail', 'type'=>'email'],
        ['name'=>'telefone', 'label'=>'Telefone'],
        ['name'=>'projeto', 'label'=>'Projeto'],
        ['name'=>'end_cep', 'label'=>'CEP'],
        ['name'=>'end_logradouro', 'label'=>'Logradouro'],
        ['name'=>'end_numero', 'label'=>'Número'],
        ['name'=>'end_complemento', 'label'=>'Complemento'],
        ['name'=>'end_bairro', 'label'=>'Bairro'],
        ['name'=>'end_cidade', 'label'=>'Cidade'],
        ['name'=>'escola_nome', 'label'=>'Escola'],
        ['name'=>'escola_escolaridade', 'label'=>'Escolaridade'],
        ['name'=>'escola_periodo', 'label'=>'Período Escolar'],
        ['name'=>'escola_serie', 'label'=>'Série'],
        ['name'=>'status_processo', 'label'=>'Status do Processo', 'type'=>'select', 'options'=>['Pendente'=>'Pendente','Aprovado'=>'Aprovado','Reprovado'=>'Reprovado'], 'default'=>'Pendente'],
    ],
]);
