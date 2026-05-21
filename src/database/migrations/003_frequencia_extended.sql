-- ============================================================
--  ERP Patrulheiros Campinas - MIGRATION 003
--  Estende a tabela frequencia com campos adicionais para
--  o novo módulo de lançamento de frequência por turma/aula
-- ============================================================

-- Adicionar colunas extras na tabela frequencia
ALTER TABLE `frequencia`
  ADD COLUMN `observacao_individual` VARCHAR(500) DEFAULT NULL COMMENT 'Observação individual do aluno' AFTER `justificativa`;

-- Tabela para registrar os dados da aula (cabeçalho da frequência)
CREATE TABLE IF NOT EXISTS `aula` (
  `id_aula` INT NOT NULL AUTO_INCREMENT,
  `id_turma` INT NOT NULL,
  `data_aula` DATE NOT NULL,
  `periodo` ENUM('Manhã','Tarde','Noite') DEFAULT NULL,
  `id_educador` INT DEFAULT NULL,
  `conteudo_ministrado` TEXT DEFAULT NULL,
  `observacoes_gerais` TEXT DEFAULT NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_aula`),
  UNIQUE KEY `uq_aula_turma_data` (`id_turma`, `data_aula`),
  CONSTRAINT `fk_aula_turma` FOREIGN KEY (`id_turma`) REFERENCES `turma` (`id_turma`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_aula_educador` FOREIGN KEY (`id_educador`) REFERENCES `educador` (`id_educador`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adicionar referência à aula na tabela frequencia
ALTER TABLE `frequencia`
  ADD COLUMN `id_aula` INT DEFAULT NULL AFTER `id`,
  ADD CONSTRAINT `fk_freq_aula` FOREIGN KEY (`id_aula`) REFERENCES `aula` (`id_aula`) ON DELETE CASCADE ON UPDATE CASCADE;
