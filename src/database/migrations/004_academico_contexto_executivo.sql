-- ============================================================
--  ERP Patrulheiros Campinas - MIGRATION 004
--  Amplia contexto executivo e operacional do modulo academico
-- ============================================================

ALTER TABLE `programa`
  ADD COLUMN `data_inicio` DATE DEFAULT NULL,
  ADD COLUMN `data_fim` DATE DEFAULT NULL,
  ADD COLUMN `publico_alvo` VARCHAR(150) DEFAULT NULL,
  ADD COLUMN `meta_jovens` INT DEFAULT NULL,
  ADD COLUMN `responsavel` VARCHAR(150) DEFAULT NULL,
  ADD COLUMN `status` ENUM('Planejado','Ativo','Encerrado','Suspenso') NOT NULL DEFAULT 'Ativo';

UPDATE `programa`
SET `status` = CASE WHEN `ativo` = 'S' THEN 'Ativo' ELSE 'Encerrado' END
WHERE `status` IS NULL OR `status` = 'Ativo';

ALTER TABLE `curso`
  ADD COLUMN `tipo_curso` ENUM('Capacitação','Aprendizagem','Trilha','Oficina') DEFAULT 'Capacitação',
  ADD COLUMN `modalidade` ENUM('Presencial','Online','Híbrido') DEFAULT 'Presencial',
  ADD COLUMN `idade_minima` INT DEFAULT NULL,
  ADD COLUMN `idade_maxima` INT DEFAULT NULL,
  ADD COLUMN `pre_requisitos` TEXT DEFAULT NULL,
  ADD COLUMN `certificacao` VARCHAR(150) DEFAULT NULL,
  ADD COLUMN `meta_turmas` INT DEFAULT NULL,
  ADD COLUMN `meta_jovens` INT DEFAULT NULL;

ALTER TABLE `disciplina`
  ADD COLUMN `tipo_disciplina` ENUM('Técnica','Comportamental','Básica') DEFAULT 'Técnica',
  ADD COLUMN `competencias` TEXT DEFAULT NULL,
  ADD COLUMN `objetivos` TEXT DEFAULT NULL,
  ADD COLUMN `metodologia` TEXT DEFAULT NULL,
  ADD COLUMN `criterio_avaliacao` TEXT DEFAULT NULL,
  ADD COLUMN `educador_preferencial` INT DEFAULT NULL,
  ADD CONSTRAINT `fk_disciplina_educador_preferencial`
    FOREIGN KEY (`educador_preferencial`) REFERENCES `educador` (`id_educador`)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `turma`
  ADD COLUMN `vagas_total` INT DEFAULT NULL,
  ADD COLUMN `sala` VARCHAR(100) DEFAULT NULL,
  ADD COLUMN `modalidade` ENUM('Presencial','Online','Híbrido') DEFAULT 'Presencial',
  ADD COLUMN `dias_semana` VARCHAR(100) DEFAULT NULL,
  ADD COLUMN `horario_inicio` TIME DEFAULT NULL,
  ADD COLUMN `horario_fim` TIME DEFAULT NULL;

UPDATE `turma`
SET `vagas_total` = `vagas`
WHERE `vagas_total` IS NULL AND `vagas` IS NOT NULL;
