-- ============================================================
--  ERP Patrulheiros Campinas - MIGRATION 001
--  Estrutura Inicial Completa (Base + Phase 1 + Phase 2)
-- ============================================================
/*!40103 SET TIME_ZONE='+00:00' */;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

-- ============================================================
--  0. MÓDULO BASE (Inscrições, Jovens, Cursos e Turmas)
-- ============================================================

CREATE TABLE IF NOT EXISTS `inscricao_2026` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome_completo` varchar(150) DEFAULT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `rg` varchar(20) DEFAULT NULL,
  `nis` varchar(20) DEFAULT NULL,
  `sexo` varchar(20) DEFAULT NULL,
  `naturalidade` varchar(100) DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `estado_civil` varchar(50) DEFAULT NULL,
  `cor_raca` varchar(50) DEFAULT NULL,
  `destro_canhoto` varchar(20) DEFAULT NULL,
  `socio_assistencial` varchar(100) DEFAULT NULL,
  `ref_cras` varchar(100) DEFAULT NULL,
  `is_deficiente` varchar(5) DEFAULT 'Não',
  `deficiencia_descricao` varchar(255) DEFAULT NULL,
  `projeto` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `escola_status` varchar(20) DEFAULT NULL,
  `escola_nome` varchar(150) DEFAULT NULL,
  `escola_escolaridade` varchar(100) DEFAULT NULL,
  `escola_periodo` varchar(50) DEFAULT NULL,
  `escola_serie` varchar(50) DEFAULT NULL,
  `escola_ra` varchar(50) DEFAULT NULL,
  `end_cep` varchar(10) DEFAULT NULL,
  `end_logradouro` varchar(150) DEFAULT NULL,
  `end_numero` varchar(20) DEFAULT NULL,
  `end_complemento` varchar(100) DEFAULT NULL,
  `end_bairro` varchar(100) DEFAULT NULL,
  `end_cidade` varchar(100) DEFAULT NULL,
  `mora_com_pais` varchar(5) DEFAULT NULL,
  `mora_com_quem` varchar(100) DEFAULT NULL,
  `qtd_pessoas_residencia` int DEFAULT NULL,
  `tipo_moradia` varchar(50) DEFAULT NULL,
  `tipo_construcao` varchar(50) DEFAULT NULL,
  `ja_trabalhou` varchar(5) DEFAULT 'Não',
  `ctps_assinada` varchar(5) DEFAULT NULL,
  `outras_rendas` decimal(10,2) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `tel_contato` varchar(20) DEFAULT NULL,
  `tel_comercial` varchar(20) DEFAULT NULL,
  `recebe_beneficio` varchar(5) DEFAULT 'Não',
  `beneficio_nome` varchar(100) DEFAULT NULL,
  `beneficio_valor` decimal(10,2) DEFAULT NULL,
  `status_processo` varchar(20) DEFAULT 'Pendente',
  `id_turma` int DEFAULT NULL,
  `data_cadastro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `inscricao_familia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_inscricao` int DEFAULT NULL,
  `parentesco` varchar(50) DEFAULT NULL,
  `nome_parente` varchar(150) DEFAULT NULL,
  `cpf_parente` varchar(14) DEFAULT NULL,
  `salario_parente` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_inscricao` (`id_inscricao`),
  CONSTRAINT `inscricao_familia_ibfk_1` FOREIGN KEY (`id_inscricao`) REFERENCES `inscricao_2026` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cadastro_jovem` (
  `id_jovem` int NOT NULL AUTO_INCREMENT,
  `id_inscricao` int DEFAULT NULL,
  `matricula` varchar(20) DEFAULT NULL,
  `inativo` char(1) DEFAULT 'N',
  `data_cadastro` date DEFAULT NULL,
  `nome_completo` varchar(150) DEFAULT NULL,
  `nome_social` varchar(150) DEFAULT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `rg` varchar(20) DEFAULT NULL,
  `orgao_emissor` varchar(20) DEFAULT NULL,
  `data_emissao_rg` date DEFAULT NULL,
  `genero` varchar(50) DEFAULT NULL,
  `orientacao_sexual` varchar(50) DEFAULT NULL,
  `nascimento` date DEFAULT NULL,
  `idade_calculada` varchar(50) DEFAULT NULL,
  `naturalidade` varchar(100) DEFAULT NULL,
  `nacionalidade` varchar(50) DEFAULT 'Brasileira',
  `estado_civil` varchar(50) DEFAULT NULL,
  `cor_raca` varchar(50) DEFAULT NULL,
  `destro_canhoto` varchar(20) DEFAULT NULL,
  `pcd` varchar(5) DEFAULT 'Não',
  `deficiencia_descricao` varchar(255) DEFAULT NULL,
  `reservista` varchar(50) DEFAULT NULL,
  `cnh` varchar(20) DEFAULT NULL,
  `tipo_cnh` varchar(5) DEFAULT NULL,
  `nis_pis` varchar(20) DEFAULT NULL,
  `ctps_numero` varchar(50) DEFAULT NULL,
  `ctps_serie` varchar(20) DEFAULT NULL,
  `banco` varchar(50) DEFAULT NULL,
  `agencia` varchar(20) DEFAULT NULL,
  `conta` varchar(20) DEFAULT NULL,
  `cep` varchar(10) DEFAULT NULL,
  `endereco` varchar(150) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `complemento` varchar(100) DEFAULT NULL,
  `bairro` varchar(100) DEFAULT NULL,
  `municipio` varchar(100) DEFAULT NULL,
  `regiao` varchar(50) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `recado` varchar(20) DEFAULT NULL,
  `outros_fones` varchar(20) DEFAULT NULL,
  `escolaridade` varchar(100) DEFAULT NULL,
  `escola` varchar(150) DEFAULT NULL,
  `periodo` varchar(50) DEFAULT NULL,
  `serie` varchar(50) DEFAULT NULL,
  `ra` varchar(50) DEFAULT NULL,
  `fundacao` varchar(50) DEFAULT NULL,
  `cras` varchar(50) DEFAULT NULL,
  `antecedentes` varchar(50) DEFAULT NULL,
  `ja_trabalhou` varchar(5) DEFAULT 'Não',
  `ctps_assinada` varchar(5) DEFAULT 'Não',
  `vuln_cor_raca` decimal(5,2) DEFAULT '0.00',
  `vuln_demografia` decimal(5,2) DEFAULT '0.00',
  `vuln_tipo_moradia` decimal(5,2) DEFAULT '0.00',
  `vuln_tipo_construcao` decimal(5,2) DEFAULT '0.00',
  `vuln_comp_familiar` decimal(5,2) DEFAULT '0.00',
  `vuln_protecao_social` decimal(5,2) DEFAULT '0.00',
  `vuln_beneficios` decimal(5,2) DEFAULT '0.00',
  `vuln_renda_percapita` decimal(5,2) DEFAULT '0.00',
  `vuln_outros` decimal(5,2) DEFAULT '0.00',
  `renda_familiar` decimal(10,2) DEFAULT '0.00',
  `nota_final` decimal(5,2) DEFAULT '0.00',
  `aprovacao_status` varchar(50) DEFAULT 'Em Análise',
  `prova_data` date DEFAULT NULL,
  `prova_horario` time DEFAULT NULL,
  `prova_sala` varchar(50) DEFAULT NULL,
  `cad_unico` varchar(5) DEFAULT 'Não',
  `observacoes_sociais` text,
  PRIMARY KEY (`id_jovem`),
  UNIQUE KEY `matricula` (`matricula`),
  UNIQUE KEY `cpf` (`cpf`),
  KEY `id_inscricao` (`id_inscricao`),
  CONSTRAINT `cadastro_jovem_ibfk_1` FOREIGN KEY (`id_inscricao`) REFERENCES `inscricao_2026` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `educador` (
  `id_educador` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `especialidade` varchar(150) DEFAULT NULL,
  `ativo` char(1) NOT NULL DEFAULT 'S',
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `descricao` text,
  PRIMARY KEY (`id_educador`),
  UNIQUE KEY `uq_educador_cpf` (`cpf`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `projeto` (
  `id_projeto` int NOT NULL AUTO_INCREMENT,
  `nome_projeto` varchar(150) NOT NULL,
  `descricao` text,
  `data_inicio` date DEFAULT NULL,
  `data_fim` date DEFAULT NULL,
  `ativo` char(1) NOT NULL DEFAULT 'S',
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_projeto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `programa` (
  `id_programa` int NOT NULL AUTO_INCREMENT,
  `id_projeto` int NOT NULL,
  `nome_programa` varchar(150) NOT NULL,
  `descricao` text,
  `ano` year DEFAULT NULL,
  `ativo` char(1) NOT NULL DEFAULT 'S',
  PRIMARY KEY (`id_programa`),
  KEY `fk_programa_projeto` (`id_projeto`),
  CONSTRAINT `fk_programa_projeto` FOREIGN KEY (`id_projeto`) REFERENCES `projeto` (`id_projeto`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `curso` (
  `id_curso` int NOT NULL AUTO_INCREMENT,
  `id_programa` int NOT NULL,
  `nome_curso` varchar(150) NOT NULL,
  `descricao` text,
  `conteudo` text,
  `carga_horaria_horas` int NOT NULL DEFAULT '0',
  `carga_horaria_minutos` int NOT NULL DEFAULT '0',
  `ativo` char(1) NOT NULL DEFAULT 'S',
  PRIMARY KEY (`id_curso`),
  KEY `fk_curso_programa` (`id_programa`),
  CONSTRAINT `fk_curso_programa` FOREIGN KEY (`id_programa`) REFERENCES `programa` (`id_programa`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `disciplina` (
  `id_disciplina` int NOT NULL AUTO_INCREMENT,
  `id_curso` int NOT NULL,
  `nome_disciplina` varchar(150) NOT NULL,
  `descricao` text,
  `carga_horaria_horas` int NOT NULL DEFAULT '0',
  `ordem` int NOT NULL DEFAULT '1',
  `carga_horaria_minutos` int NOT NULL DEFAULT '0',
  `ativo` char(1) NOT NULL DEFAULT 'S',
  PRIMARY KEY (`id_disciplina`),
  KEY `fk_disciplina_curso` (`id_curso`),
  CONSTRAINT `fk_disciplina_curso` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `turma` (
  `id_turma` int NOT NULL AUTO_INCREMENT,
  `id_curso` int NOT NULL,
  `id_educador` int DEFAULT NULL,
  `codigo_turma` varchar(50) NOT NULL,
  `periodo` enum('Matutino','Vespertino','Noturno','Integral') NOT NULL DEFAULT 'Matutino',
  `data_inicio` date DEFAULT NULL,
  `data_fim` date DEFAULT NULL,
  `ativo` char(1) NOT NULL DEFAULT 'S',
  `descricao` text,
  PRIMARY KEY (`id_turma`),
  UNIQUE KEY `uq_turma_codigo` (`codigo_turma`),
  KEY `fk_turma_curso` (`id_curso`),
  KEY `fk_turma_educador` (`id_educador`),
  CONSTRAINT `fk_turma_curso` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`) ON UPDATE CASCADE,
  CONSTRAINT `fk_turma_educador` FOREIGN KEY (`id_educador`) REFERENCES `educador` (`id_educador`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `matricula_turma` (
  `id_matricula` int NOT NULL AUTO_INCREMENT,
  `id_jovem` int NOT NULL,
  `id_turma` int NOT NULL,
  `data_matricula` date NOT NULL,
  `status_matricula` enum('Cursando','Concluído','Desistente','Reprovado','Transferido') NOT NULL DEFAULT 'Cursando',
  PRIMARY KEY (`id_matricula`),
  UNIQUE KEY `uq_jovem_turma` (`id_jovem`,`id_turma`),
  KEY `fk_mat_turma` (`id_turma`),
  CONSTRAINT `fk_mat_jovem` FOREIGN KEY (`id_jovem`) REFERENCES `cadastro_jovem` (`id_jovem`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_mat_turma` FOREIGN KEY (`id_turma`) REFERENCES `turma` (`id_turma`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `boletim_nota` (
  `id_nota` int NOT NULL AUTO_INCREMENT,
  `id_matricula` int NOT NULL,
  `id_disciplina` int NOT NULL,
  `periodo_avaliacao` varchar(50) DEFAULT NULL,
  `nota` decimal(5,2) DEFAULT NULL,
  `faltas` int NOT NULL DEFAULT '0',
  `presencas` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_nota`),
  UNIQUE KEY `uq_boletim` (`id_matricula`,`id_disciplina`,`periodo_avaliacao`),
  KEY `fk_bol_disciplina` (`id_disciplina`),
  CONSTRAINT `fk_bol_disciplina` FOREIGN KEY (`id_disciplina`) REFERENCES `disciplina` (`id_disciplina`) ON UPDATE CASCADE,
  CONSTRAINT `fk_bol_matricula` FOREIGN KEY (`id_matricula`) REFERENCES `matricula_turma` (`id_matricula`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `empresa` (
  `id_empresa` int NOT NULL AUTO_INCREMENT,
  `razao_social` varchar(150) NOT NULL,
  `nome_fantasia` varchar(150) DEFAULT NULL,
  `cnpj` varchar(18) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `logradouro` varchar(150) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `bairro` varchar(100) DEFAULT NULL,
  `municipio` varchar(100) DEFAULT 'Campinas',
  `uf` char(2) DEFAULT 'SP',
  `cep` varchar(10) DEFAULT NULL,
  `responsavel_rh` varchar(150) DEFAULT NULL,
  `cota_aprendizes` int DEFAULT '0',
  `ativo` char(1) NOT NULL DEFAULT 'S',
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `observacoes` text,
  PRIMARY KEY (`id_empresa`),
  UNIQUE KEY `uq_empresa_cnpj` (`cnpj`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contrato_aprendiz` (
  `id_contrato` int NOT NULL AUTO_INCREMENT,
  `id_jovem` int NOT NULL,
  `id_empresa` int NOT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date NOT NULL,
  `cargo` varchar(100) DEFAULT 'Aprendiz Administrativo',
  `salario` decimal(10,2) DEFAULT '0.00',
  `status_contrato` enum('Ativo','Encerrado','Rescindido') NOT NULL DEFAULT 'Ativo',
  `observacoes` text,
  `criado_em` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_contrato`),
  KEY `fk_contrato_jovem` (`id_jovem`),
  KEY `fk_contrato_empresa` (`id_empresa`),
  CONSTRAINT `fk_contrato_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE RESTRICT,
  CONSTRAINT `fk_contrato_jovem` FOREIGN KEY (`id_jovem`) REFERENCES `cadastro_jovem` (`id_jovem`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
--  PHASE 1: Frequência, Ocorrências, Feriados e Férias
-- ============================================================

CREATE TABLE IF NOT EXISTS `frequencia` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `matricula_id` INT NOT NULL,
  `data_aula` DATE NOT NULL,
  `presente` TINYINT(1) NOT NULL DEFAULT 1,
  `justificativa` VARCHAR(500) DEFAULT NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_freq_matricula_data` (`matricula_id`, `data_aula`),
  CONSTRAINT `fk_freq_matricula` FOREIGN KEY (`matricula_id`) REFERENCES `matricula_turma` (`id_matricula`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ocorrencia` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `jovem_id` INT NOT NULL,
  `educador_id` INT DEFAULT NULL,
  `data_ocorrencia` DATE NOT NULL,
  `tipo` ENUM('comportamental','atraso','falta','merito') NOT NULL DEFAULT 'comportamental',
  `gravidade` ENUM('leve','media','grave') NOT NULL DEFAULT 'leve',
  `descricao` TEXT NOT NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ocorr_jovem` FOREIGN KEY (`jovem_id`) REFERENCES `cadastro_jovem` (`id_jovem`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ocorr_educador` FOREIGN KEY (`educador_id`) REFERENCES `educador` (`id_educador`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `feriado` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `data` DATE NOT NULL,
  `nome` VARCHAR(150) NOT NULL,
  `tipo` ENUM('nacional','estadual','municipal','emoradia') DEFAULT 'municipal',
  `ativo` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_feriado_data` (`data`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ferias_jovem` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `matricula_id` INT NOT NULL,
  `data_inicio` DATE NOT NULL,
  `data_fim` DATE NOT NULL,
  `observacoes` VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ferias_matricula` FOREIGN KEY (`matricula_id`) REFERENCES `matricula_turma` (`id_matricula`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  PHASE 1: Módulo Social / Assistência Social
-- ============================================================

CREATE TABLE IF NOT EXISTS `perfil_acesso` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `descricao` VARCHAR(255) DEFAULT NULL,
  `nivel` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `senha_hash` VARCHAR(255) NOT NULL,
  `perfil_id` INT DEFAULT NULL,
  `ativo` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuario_email` (`email`),
  CONSTRAINT `fk_usuario_perfil` FOREIGN KEY (`perfil_id`) REFERENCES `perfil_acesso` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `atendimento_social` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `jovem_id` INT NOT NULL,
  `profissional_id` INT DEFAULT NULL,
  `data` DATE NOT NULL,
  `tipo` ENUM('individual','grupo') NOT NULL DEFAULT 'individual',
  `descricao` TEXT NOT NULL,
  `encaminhamentos` VARCHAR(500) DEFAULT NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_atsoc_jovem` FOREIGN KEY (`jovem_id`) REFERENCES `cadastro_jovem` (`id_jovem`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_atsoc_profissional` FOREIGN KEY (`profissional_id`) REFERENCES `usuario` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `questionario_socioeconomico` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `jovem_id` INT NOT NULL,
  `data_preenchimento` DATE DEFAULT NULL,
  `renda_familiar` DECIMAL(10,2) DEFAULT NULL,
  `composicao_familiar` TEXT DEFAULT NULL,
  `beneficios_sociais` TINYINT(1) DEFAULT 0,
  `situacao_habitacional` ENUM('propria','alugada','cedida','outros') DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_qse_jovem` (`jovem_id`),
  CONSTRAINT `fk_qse_jovem` FOREIGN KEY (`jovem_id`) REFERENCES `cadastro_jovem` (`id_jovem`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `parecer_social` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `jovem_id` INT NOT NULL,
  `profissional_id` INT DEFAULT NULL,
  `data_parecer` DATE DEFAULT NULL,
  `parecer` TEXT DEFAULT NULL,
  `recomendacoes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_parecer_jovem` FOREIGN KEY (`jovem_id`) REFERENCES `cadastro_jovem` (`id_jovem`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
--  PHASE 2: Contratos e Escolas
-- ============================================================

CREATE TABLE IF NOT EXISTS `escola` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(200) NOT NULL,
  `cnpj` VARCHAR(18) DEFAULT NULL,
  `endereco` VARCHAR(255) DEFAULT NULL,
  `telefone` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `responsavel` VARCHAR(150) DEFAULT NULL,
  `ativo` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contrato_estagio` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `jovem_id` INT NOT NULL,
  `empresa_id` INT NOT NULL,
  `escola_id` INT DEFAULT NULL,
  `supervisor` VARCHAR(150) DEFAULT NULL,
  `valor_bolsa` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `carga_horaria_semanal` INT DEFAULT 30,
  `data_inicio` DATE DEFAULT NULL,
  `data_fim` DATE DEFAULT NULL,
  `status` ENUM('Ativo','Encerrado','Rescindido') DEFAULT 'Ativo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ce_jovem` FOREIGN KEY (`jovem_id`) REFERENCES `cadastro_jovem` (`id_jovem`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ce_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ce_escola` FOREIGN KEY (`escola_id`) REFERENCES `escola` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `documento_contrato` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `contrato_estagio_id` INT NOT NULL,
  `tipo_documento` VARCHAR(100) DEFAULT NULL,
  `nome_arquivo` VARCHAR(255) NOT NULL,
  `caminho_arquivo` VARCHAR(500) NOT NULL,
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_doc_contrato` FOREIGN KEY (`contrato_estagio_id`) REFERENCES `contrato_estagio` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `assinatura_digital` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `documento_contrato_id` INT NOT NULL,
  `signatario` VARCHAR(150) NOT NULL,
  `email_signatario` VARCHAR(150) DEFAULT NULL,
  `hash_assinatura` VARCHAR(64) DEFAULT NULL,
  `data_assinatura` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `ip_assinatura` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ass_doc` FOREIGN KEY (`documento_contrato_id`) REFERENCES `documento_contrato` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
--  PHASE 2: Financeiro
-- ============================================================

CREATE TABLE IF NOT EXISTS `plano_conta` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(20) NOT NULL,
  `nome` VARCHAR(150) NOT NULL,
  `tipo` ENUM('receita','despesa') NOT NULL,
  `categoria` VARCHAR(100) DEFAULT NULL,
  `ativo` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_plano_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `evento_financeiro` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tipo` ENUM('receita','despesa') NOT NULL,
  `plano_conta_id` INT DEFAULT NULL,
  `descricao` VARCHAR(255) NOT NULL,
  `valor` DECIMAL(12,2) NOT NULL,
  `data_evento` DATE NOT NULL,
  `data_vencimento` DATE DEFAULT NULL,
  `status` ENUM('pendente','pago','cancelado') DEFAULT 'pendente',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ef_plano` FOREIGN KEY (`plano_conta_id`) REFERENCES `plano_conta` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `folha_pagamento` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `contrato_id` INT NOT NULL,
  `competencia` VARCHAR(7) NOT NULL,
  `valor_bruto` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `descontos` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `valor_liquido` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('pendente','pago') DEFAULT 'pendente',
  `data_pagamento` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_folha_contrato_comp` (`contrato_id`, `competencia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `fatura_empresa` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `empresa_id` INT NOT NULL,
  `competencia` VARCHAR(7) NOT NULL,
  `valor_total` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `status` ENUM('pendente','pago','vencido') DEFAULT 'pendente',
  `data_vencimento` DATE DEFAULT NULL,
  `data_pagamento` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_fatura_empresa_comp` (`empresa_id`, `competencia`),
  CONSTRAINT `fk_fatura_empresa` FOREIGN KEY (`empresa_id`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `seguradora` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(200) NOT NULL,
  `cnpj` VARCHAR(18) DEFAULT NULL,
  `telefone` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `contato` VARCHAR(150) DEFAULT NULL,
  `ativo` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `seguro_jovem` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `jovem_id` INT NOT NULL,
  `seguradora_id` INT NOT NULL,
  `numero_apolice` VARCHAR(50) NOT NULL,
  `data_inicio` DATE DEFAULT NULL,
  `data_fim` DATE DEFAULT NULL,
  `valor_cobertura` DECIMAL(12,2) DEFAULT NULL,
  `status` ENUM('ativo','cancelado','encerrado') DEFAULT 'ativo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_seguro_apolice` (`numero_apolice`),
  CONSTRAINT `fk_sj_jovem` FOREIGN KEY (`jovem_id`) REFERENCES `cadastro_jovem` (`id_jovem`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_sj_seguradora` FOREIGN KEY (`seguradora_id`) REFERENCES `seguradora` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DADOS INICIAIS PADRÃO
-- ============================================================
INSERT IGNORE INTO `perfil_acesso` (`id`, `nome`, `descricao`, `nivel`) VALUES
(1, 'Administrador', 'Acesso completo ao sistema', 3),
(2, 'Operador', 'Cadastro e operações do dia-a-dia', 2),
(3, 'Visualizador', 'Apenas leitura de dados', 1);

SET FOREIGN_KEY_CHECKS=1;
