-- ============================================================
--  ERP Jovem Aprendiz — Patrulheiros Campinas
--  Modelo v2 — Gerado em 28/04/2026
--  Compatível com MySQL 8.0+  |  CHARSET utf8mb4
-- ============================================================
--  INSTRUÇÕES DE USO:
--  1. Execute este script no banco "erp_aprendiz" existente.
--  2. As tabelas inscricao_2026, inscricao_familia e cadastro_jovem
--     NÃO são alteradas — apenas novas tabelas são criadas.
--  3. A tabela "curso" existente é substituída pela nova versão.
--  4. As tabelas "turma", "materia" e "boletim_nota" são substituídas.
--  5. Execute na ordem abaixo para respeitar as FKs.
-- ============================================================

/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;
/*!50503 SET NAMES utf8mb4 */;

-- ------------------------------------------------------------
-- PASSO 1: Remover tabelas antigas que serão substituídas
-- (somente as que mudaram de estrutura)
-- ------------------------------------------------------------

DROP TABLE IF EXISTS `boletim_nota`;
DROP TABLE IF EXISTS `matricula_turma`;
DROP TABLE IF EXISTS `turma`;
DROP TABLE IF EXISTS `materia`;
DROP TABLE IF EXISTS `curso`;

-- ------------------------------------------------------------
-- PASSO 2: EDUCADOR
-- Responsável por uma ou mais turmas (ex: Eliseu José Machado)
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `educador` (
  `id_educador`  INT          NOT NULL AUTO_INCREMENT,
  `nome`         VARCHAR(150) NOT NULL,
  `email`        VARCHAR(150)          DEFAULT NULL,
  `cpf`          VARCHAR(14)           DEFAULT NULL,
  `telefone`     VARCHAR(20)           DEFAULT NULL,
  `especialidade` VARCHAR(150)         DEFAULT NULL,
  `ativo`        CHAR(1)      NOT NULL DEFAULT 'S'
                              COMMENT 'S=ativo, N=inativo',
  `criado_em`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_educador`),
  UNIQUE KEY `uq_educador_cpf` (`cpf`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Educadores e gestores de atividade';

-- ------------------------------------------------------------
-- PASSO 3: PROJETO
-- Ex: Jovem Aprendiz, Formação Geral, Transformação, etc.
-- Um jovem aprovado pode participar de vários projetos
-- via a tabela matricula_turma → turma → curso → programa → projeto
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `projeto` (
  `id_projeto`  INT          NOT NULL AUTO_INCREMENT,
  `nome_projeto` VARCHAR(150) NOT NULL,
  `descricao`   TEXT                  DEFAULT NULL,
  `data_inicio` DATE                  DEFAULT NULL,
  `data_fim`    DATE                  DEFAULT NULL,
  `ativo`       CHAR(1)      NOT NULL DEFAULT 'S'
                             COMMENT 'S=ativo, N=encerrado',
  `criado_em`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_projeto`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Projetos da entidade: Aprendiz, Formação Geral, Transformação...';

-- Dados iniciais de exemplo
INSERT INTO `projeto` (`nome_projeto`, `descricao`, `data_inicio`, `ativo`)
VALUES
  ('Jovem Aprendiz',    'Inserção do jovem no mercado de trabalho via CLT Aprendiz', '2026-01-01', 'S'),
  ('Formação Geral',    'Oficinas de Formação Geral para o Mundo do Trabalho (OFGMT)', '2026-01-01', 'S'),
  ('Transformação',     'Projeto de desenvolvimento socioemocional', '2026-01-01', 'S');

-- ------------------------------------------------------------
-- PASSO 4: PROGRAMA
-- Agrupamento de cursos dentro de um projeto
-- Ex: projeto "Formação Geral" → programa "OFGMT Turma 22/2021"
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `programa` (
  `id_programa`  INT          NOT NULL AUTO_INCREMENT,
  `id_projeto`   INT          NOT NULL,
  `nome_programa` VARCHAR(150) NOT NULL,
  `descricao`    TEXT                  DEFAULT NULL,
  `ano`          YEAR                  DEFAULT NULL,
  `ativo`        CHAR(1)      NOT NULL DEFAULT 'S',
  `criado_em`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_programa`),
  KEY `fk_programa_projeto` (`id_projeto`),
  CONSTRAINT `fk_programa_projeto`
    FOREIGN KEY (`id_projeto`) REFERENCES `projeto` (`id_projeto`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Programas dentro de um projeto (ex: OFGMT 2021, OFGMT 2026)';

-- Dado inicial de exemplo
INSERT INTO `programa` (`id_projeto`, `nome_programa`, `descricao`, `ano`, `ativo`)
VALUES
  (2, 'OFGMT 2021', 'Oficinas de Formação Geral para o Mundo do Trabalho 2021', 2021, 'S'),
  (2, 'OFGMT 2026', 'Oficinas de Formação Geral para o Mundo do Trabalho 2026', 2026, 'S');

-- ------------------------------------------------------------
-- PASSO 5: CURSO
-- Substitui a tabela "curso" anterior.
-- Agora tem conteúdo, carga horária detalhada e vínculo com programa.
-- Um programa pode ter vários cursos.
-- ------------------------------------------------------------

CREATE TABLE `curso` (
  `id_curso`              INT          NOT NULL AUTO_INCREMENT,
  `id_programa`           INT          NOT NULL,
  `nome_curso`            VARCHAR(150) NOT NULL,
  `descricao`             TEXT                  DEFAULT NULL,
  `conteudo`              TEXT                  DEFAULT NULL
                                       COMMENT 'Ementa / conteúdo programático',
  `carga_horaria_horas`   INT          NOT NULL DEFAULT 0,
  `carga_horaria_minutos` INT          NOT NULL DEFAULT 0
                                       COMMENT 'Complemento em minutos (0, 30)',
  `ativo`                 CHAR(1)      NOT NULL DEFAULT 'S',
  `criado_em`             TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em`         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                       ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_curso`),
  KEY `fk_curso_programa` (`id_programa`),
  CONSTRAINT `fk_curso_programa`
    FOREIGN KEY (`id_programa`) REFERENCES `programa` (`id_programa`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Cursos oferecidos dentro de um programa';

-- Dado inicial de exemplo (Informática Básica OFGMT 2021)
INSERT INTO `curso`
  (`id_programa`, `nome_curso`, `descricao`, `conteudo`, `carga_horaria_horas`, `carga_horaria_minutos`, `ativo`)
VALUES (
  1,
  'Informática Básica',
  'Curso introdutório de informática para o mundo do trabalho',
  'Sistemas Operacionais (Windows e Linux); Armazenamento em Nuvem (Google Drive, OneDrive); E-mail e Segurança de Dados; LGPD; Google Docs; Microsoft Word (tabelas, mala direta, formulários); Atividades em grupo.',
  35, 0, 'S'
);

-- ------------------------------------------------------------
-- PASSO 6: DISCIPLINA
-- Grade curricular do curso (ex: os "encontros" do relatório)
-- Um curso tem várias disciplinas.
-- ------------------------------------------------------------

CREATE TABLE `disciplina` (
  `id_disciplina`       INT          NOT NULL AUTO_INCREMENT,
  `id_curso`            INT          NOT NULL,
  `nome_disciplina`     VARCHAR(150) NOT NULL,
  `descricao`           TEXT                  DEFAULT NULL,
  `carga_horaria_horas` INT          NOT NULL DEFAULT 0
                                     COMMENT 'Carga horária desta disciplina',
  `carga_horaria_minutos` INT        NOT NULL DEFAULT 0,
  `ordem`               INT          NOT NULL DEFAULT 1
                                     COMMENT 'Ordem na grade (encontro 1, 2, 3...)',
  `ativo`               CHAR(1)      NOT NULL DEFAULT 'S',
  PRIMARY KEY (`id_disciplina`),
  KEY `fk_disciplina_curso` (`id_curso`),
  CONSTRAINT `fk_disciplina_curso`
    FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Grade curricular de cada curso (encontros / módulos)';

-- Dados iniciais: grade do curso Informática Básica (id_curso=1)
INSERT INTO `disciplina`
  (`id_curso`, `nome_disciplina`, `descricao`, `carga_horaria_horas`, `carga_horaria_minutos`, `ordem`)
VALUES
  (1, 'Servidores de Arquivos em Nuvem',  'Google Drive e OneDrive: estrutura, pastas, compartilhamento', 3, 30, 1),
  (1, 'E-mail e Segurança de Dados',       'Envio/recebimento, spam, LGPD, vírus e ataques na rede',      3, 30, 2),
  (1, 'Sistemas Operacionais',             'Windows, Linux, Android e iPhone: pastas, arquivos, apps',     3, 30, 3),
  (1, 'Google Docs',                       'Configuração de página, fontes, imagens, colunas',             3, 30, 4),
  (1, 'Microsoft Word I',                  'Configuração de página, fontes, imagens, colunas',             3, 30, 5),
  (1, 'Microsoft Word II — Tabelas',       'Linhas, colunas, mesclagem de células, alinhamento',           3, 30, 6),
  (1, 'Microsoft Word III — Mala Direta',  'Mala direta e formulários',                                    3, 30, 7),
  (1, 'Atividade em Grupo I',              'Fixação: editor de texto, nuvem, compartilhamento',            3, 30, 8),
  (1, 'Atividade em Grupo II',             'Continuação da atividade em grupo',                            3, 30, 9),
  (1, 'Fechamento do Curso',               'Médias, pesquisa de final de curso, avaliação',                3, 30, 10);

-- ------------------------------------------------------------
-- PASSO 7: TURMA
-- Oferta do curso em um período, sala e educador específicos.
-- Um curso pode gerar várias turmas (matutino, vespertino, etc.)
-- ------------------------------------------------------------

CREATE TABLE `turma` (
  `id_turma`      INT          NOT NULL AUTO_INCREMENT,
  `id_curso`      INT          NOT NULL,
  `id_educador`   INT                   DEFAULT NULL,
  `codigo_turma`  VARCHAR(50)  NOT NULL COMMENT 'Ex: Turma 22/2021',
  `periodo`       ENUM('Matutino','Vespertino','Noturno','Integral')
                               NOT NULL DEFAULT 'Matutino',
  `data_inicio`   DATE                  DEFAULT NULL,
  `data_fim`      DATE                  DEFAULT NULL,
  `vagas`         INT                   DEFAULT NULL,
  `local`         VARCHAR(150)          DEFAULT NULL,
  `ativo`         CHAR(1)      NOT NULL DEFAULT 'S',
  `criado_em`     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_turma`),
  UNIQUE KEY `uq_turma_codigo` (`codigo_turma`),
  KEY `fk_turma_curso`     (`id_curso`),
  KEY `fk_turma_educador`  (`id_educador`),
  CONSTRAINT `fk_turma_curso`
    FOREIGN KEY (`id_curso`)    REFERENCES `curso`    (`id_curso`)    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_turma_educador`
    FOREIGN KEY (`id_educador`) REFERENCES `educador` (`id_educador`) ON DELETE SET NULL  ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Oferta de um curso: turma, período, educador e datas';

-- ------------------------------------------------------------
-- PASSO 8: MATRÍCULA_TURMA
-- Vínculo N:N entre jovem e turma.
-- Um jovem pode estar matriculado em várias turmas
-- (diferentes projetos / cursos).
-- ------------------------------------------------------------

CREATE TABLE `matricula_turma` (
  `id_matricula`    INT  NOT NULL AUTO_INCREMENT,
  `id_jovem`        INT  NOT NULL,
  `id_turma`        INT  NOT NULL,
  `data_matricula`  DATE NOT NULL,
  `status_matricula` ENUM('Cursando','Concluído','Desistente','Reprovado','Transferido')
                         NOT NULL DEFAULT 'Cursando',
  `observacoes`     TEXT          DEFAULT NULL,
  `criado_em`       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_matricula`),
  UNIQUE KEY `uq_jovem_turma` (`id_jovem`, `id_turma`)
             COMMENT 'Um jovem só pode ser matriculado uma vez na mesma turma',
  KEY `fk_mat_jovem` (`id_jovem`),
  KEY `fk_mat_turma` (`id_turma`),
  CONSTRAINT `fk_mat_jovem`
    FOREIGN KEY (`id_jovem`) REFERENCES `cadastro_jovem` (`id_jovem`) ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT `fk_mat_turma`
    FOREIGN KEY (`id_turma`) REFERENCES `turma`          (`id_turma`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Matrícula do jovem em uma turma (resolve o N:N jovem × turma)';

-- ------------------------------------------------------------
-- PASSO 9: BOLETIM_NOTA
-- Nota e presença do jovem por disciplina dentro de uma matrícula.
-- Um registro por (matrícula × disciplina × período de avaliação).
-- ------------------------------------------------------------

CREATE TABLE `boletim_nota` (
  `id_nota`           INT           NOT NULL AUTO_INCREMENT,
  `id_matricula`      INT           NOT NULL,
  `id_disciplina`     INT           NOT NULL,
  `periodo_avaliacao` VARCHAR(50)            DEFAULT NULL
                                    COMMENT 'Ex: Bimestre 1, Janeiro/2022',
  `nota`              DECIMAL(5,2)           DEFAULT NULL
                                    COMMENT 'Nota de 0,00 a 10,00',
  `faltas`            INT           NOT NULL DEFAULT 0,
  `presencas`         INT           NOT NULL DEFAULT 0,
  `observacoes`       TEXT                   DEFAULT NULL,
  `criado_em`         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em`     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_nota`),
  UNIQUE KEY `uq_boletim` (`id_matricula`, `id_disciplina`, `periodo_avaliacao`)
             COMMENT 'Uma nota por matrícula × disciplina × período',
  KEY `fk_bol_matricula`  (`id_matricula`),
  KEY `fk_bol_disciplina` (`id_disciplina`),
  CONSTRAINT `fk_bol_matricula`
    FOREIGN KEY (`id_matricula`)  REFERENCES `matricula_turma` (`id_matricula`) ON DELETE CASCADE  ON UPDATE CASCADE,
  CONSTRAINT `fk_bol_disciplina`
    FOREIGN KEY (`id_disciplina`) REFERENCES `disciplina`      (`id_disciplina`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Boletim: nota e presença do jovem por disciplina e período';

-- ------------------------------------------------------------
-- PASSO 10: VIEW AUXILIAR — boletim completo por jovem
-- Facilita relatórios no ScripCase sem JOINs manuais
-- ------------------------------------------------------------

CREATE OR REPLACE VIEW `vw_boletim_jovem` AS
SELECT
  j.id_jovem,
  j.matricula                          AS matricula_jovem,
  j.nome_completo                      AS nome_jovem,
  p.nome_projeto,
  pg.nome_programa,
  c.nome_curso,
  t.codigo_turma,
  t.periodo,
  d.ordem                              AS ordem_disciplina,
  d.nome_disciplina,
  bn.periodo_avaliacao,
  bn.nota,
  bn.faltas,
  bn.presencas,
  mt.status_matricula,
  e.nome                               AS educador
FROM boletim_nota bn
JOIN matricula_turma  mt ON mt.id_matricula  = bn.id_matricula
JOIN cadastro_jovem   j  ON j.id_jovem       = mt.id_jovem
JOIN turma            t  ON t.id_turma        = mt.id_turma
JOIN disciplina       d  ON d.id_disciplina   = bn.id_disciplina
JOIN curso            c  ON c.id_curso        = t.id_curso
JOIN programa         pg ON pg.id_programa    = c.id_programa
JOIN projeto          p  ON p.id_projeto      = pg.id_projeto
LEFT JOIN educador    e  ON e.id_educador     = t.id_educador;

-- ------------------------------------------------------------
-- PASSO 11: VIEW AUXILIAR — resumo de matrícula por jovem
-- ------------------------------------------------------------

CREATE OR REPLACE VIEW `vw_matriculas_jovem` AS
SELECT
  j.id_jovem,
  j.matricula                          AS matricula_jovem,
  j.nome_completo                      AS nome_jovem,
  p.id_projeto,
  p.nome_projeto,
  pg.id_programa,
  pg.nome_programa,
  c.id_curso,
  c.nome_curso,
  t.id_turma,
  t.codigo_turma,
  t.periodo,
  t.data_inicio,
  t.data_fim,
  mt.id_matricula,
  mt.data_matricula,
  mt.status_matricula,
  e.nome                               AS educador
FROM matricula_turma mt
JOIN cadastro_jovem  j  ON j.id_jovem    = mt.id_jovem
JOIN turma           t  ON t.id_turma    = mt.id_turma
JOIN curso           c  ON c.id_curso    = t.id_curso
JOIN programa        pg ON pg.id_programa = c.id_programa
JOIN projeto         p  ON p.id_projeto  = pg.id_projeto
LEFT JOIN educador   e  ON e.id_educador = t.id_educador;

-- ------------------------------------------------------------
-- FIM DO SCRIPT
-- ------------------------------------------------------------

/*!40014 SET FOREIGN_KEY_CHECKS=1 */;

-- ============================================================
--  RESUMO DAS TABELAS CRIADAS / ALTERADAS
-- ============================================================
--
--  MANTIDAS (sem alteração):
--    inscricao_2026      — formulário de inscrição + trigger
--    inscricao_familia   — núcleo familiar do candidato
--    cadastro_jovem      — ficha do jovem aprovado
--
--  NOVAS:
--    educador            — educadores/gestores de atividade
--    projeto             — projetos da entidade (Aprendiz, OFGMT...)
--    programa            — agrupamento de cursos por projeto/ano
--    disciplina          — grade curricular de cada curso
--
--  SUBSTITUÍDAS (estrutura ampliada):
--    curso               — agora tem conteúdo, CH detalhada e programa
--    turma               — agora tem educador, período e vagas
--    matricula_turma     — adicionado status Transferido e unique key
--    boletim_nota        — agora referencia disciplina (não materia)
--    materia             — REMOVIDA (substituída por disciplina)
--
--  VIEWS AUXILIARES (para relatórios no ScripCase):
--    vw_boletim_jovem    — boletim completo com todos os JOINs
--    vw_matriculas_jovem — lista de matrículas por jovem/projeto
-- ============================================================
