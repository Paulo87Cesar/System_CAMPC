-- ============================================================
--  ERP Patrulheiros Campinas - MIGRATION 002
--  Adiciona colunas 'vagas' e 'local' na tabela turma
-- ============================================================
ALTER TABLE `turma`
  ADD COLUMN `vagas` INT DEFAULT NULL COMMENT 'Número máximo de vagas da turma',
  ADD COLUMN `local` VARCHAR(255) DEFAULT NULL COMMENT 'Local onde a turma ocorre';
