-- Removendo o campo id_programa que não é mais necessário
ALTER TABLE `curso` DROP COLUMN `id_programa`;

-- Garantindo que o campo descricao e outros existam
ALTER TABLE `curso` ADD COLUMN IF NOT EXISTS `descricao` TEXT DEFAULT NULL AFTER `nome_curso`;
ALTER TABLE `curso` ADD COLUMN IF NOT EXISTS `conteudo` TEXT DEFAULT NULL AFTER `descricao`;
ALTER TABLE `curso` ADD COLUMN IF NOT EXISTS `carga_horaria_horas` INT NOT NULL DEFAULT 0;
ALTER TABLE `curso` ADD COLUMN IF NOT EXISTS `carga_horaria_minutos` INT NOT NULL DEFAULT 0;
ALTER TABLE `curso` ADD COLUMN IF NOT EXISTS `ativo` CHAR(1) NOT NULL DEFAULT 'S';

-- Adicionando campos de descrição em outras tabelas para consistência
ALTER TABLE `turma` ADD COLUMN IF NOT EXISTS `descricao` TEXT DEFAULT NULL;
ALTER TABLE `educador` ADD COLUMN IF NOT EXISTS `descricao` TEXT DEFAULT NULL;
ALTER TABLE `empresa` ADD COLUMN IF NOT EXISTS `observacoes` TEXT DEFAULT NULL;
