-- Adicionando campos faltantes na tabela CURSO (para compatibilidade com o novo ERP)
ALTER TABLE `curso` ADD COLUMN `id_programa` INT DEFAULT NULL AFTER `id_curso`;
ALTER TABLE `curso` ADD COLUMN `descricao` TEXT DEFAULT NULL AFTER `nome_curso`;
ALTER TABLE `curso` ADD COLUMN `conteudo` TEXT DEFAULT NULL AFTER `descricao`;
ALTER TABLE `curso` ADD COLUMN `carga_horaria_horas` INT NOT NULL DEFAULT 0 AFTER `conteudo`;
ALTER TABLE `curso` ADD COLUMN `carga_horaria_minutos` INT NOT NULL DEFAULT 0 AFTER `carga_horaria_horas`;
ALTER TABLE `curso` ADD COLUMN `ativo` CHAR(1) NOT NULL DEFAULT 'S';

-- Adicionando campos de descrição/observação em outras tabelas para consistência
ALTER TABLE `turma` ADD COLUMN `descricao` TEXT DEFAULT NULL;
ALTER TABLE `educador` ADD COLUMN `descricao` TEXT DEFAULT NULL;
ALTER TABLE `empresa` ADD COLUMN `observacoes` TEXT DEFAULT NULL;
