-- ============================================================
--  MÓDULO: EMPRESAS E CONTRATOS (Expansão ERP Jovem Aprendiz)
-- ============================================================

-- 1. Tabela de Empresas Parceiras
CREATE TABLE IF NOT EXISTS `empresa` (
  `id_empresa`     INT          NOT NULL AUTO_INCREMENT,
  `razao_social`   VARCHAR(150) NOT NULL,
  `nome_fantasia`  VARCHAR(150)          DEFAULT NULL,
  `cnpj`           VARCHAR(18)  NOT NULL,
  `email`          VARCHAR(150)          DEFAULT NULL,
  `telefone`       VARCHAR(20)           DEFAULT NULL,
  `logradouro`     VARCHAR(150)          DEFAULT NULL,
  `numero`         VARCHAR(20)           DEFAULT NULL,
  `bairro`         VARCHAR(100)          DEFAULT NULL,
  `municipio`      VARCHAR(100)          DEFAULT 'Campinas',
  `uf`             CHAR(2)               DEFAULT 'SP',
  `cep`            VARCHAR(10)           DEFAULT NULL,
  `responsavel_rh` VARCHAR(150)          DEFAULT NULL,
  `cota_aprendizes` INT                  DEFAULT 0,
  `ativo`          CHAR(1)      NOT NULL DEFAULT 'S',
  `criado_em`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_empresa`),
  UNIQUE KEY `uq_empresa_cnpj` (`cnpj`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabela de Contratos de Aprendizagem
-- Vincula o jovem à empresa parceira
CREATE TABLE IF NOT EXISTS `contrato_aprendiz` (
  `id_contrato`    INT          NOT NULL AUTO_INCREMENT,
  `id_jovem`       INT          NOT NULL,
  `id_empresa`     INT          NOT NULL,
  `data_inicio`    DATE         NOT NULL,
  `data_fim`       DATE         NOT NULL,
  `cargo`          VARCHAR(100)          DEFAULT 'Aprendiz Administrativo',
  `salario`        DECIMAL(10,2)         DEFAULT 0.00,
  `status_contrato` ENUM('Ativo', 'Encerrado', 'Rescindido') NOT NULL DEFAULT 'Ativo',
  `observacoes`    TEXT                  DEFAULT NULL,
  `criado_em`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_contrato`),
  KEY `fk_contrato_jovem`   (`id_jovem`),
  KEY `fk_contrato_empresa` (`id_empresa`),
  CONSTRAINT `fk_contrato_jovem`   FOREIGN KEY (`id_jovem`)   REFERENCES `cadastro_jovem` (`id_jovem`) ON DELETE CASCADE,
  CONSTRAINT `fk_contrato_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
