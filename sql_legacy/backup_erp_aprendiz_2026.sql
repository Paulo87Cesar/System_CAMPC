-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: erp_aprendiz
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `boletim_nota`
--

DROP TABLE IF EXISTS `boletim_nota`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `boletim_nota` (
  `id_nota` int NOT NULL AUTO_INCREMENT,
  `id_matricula` int NOT NULL,
  `id_materia` int NOT NULL,
  `periodo_avaliacao` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nota` decimal(5,2) DEFAULT NULL,
  `faltas` int DEFAULT '0',
  PRIMARY KEY (`id_nota`),
  KEY `id_matricula` (`id_matricula`),
  KEY `id_materia` (`id_materia`),
  CONSTRAINT `boletim_nota_ibfk_1` FOREIGN KEY (`id_matricula`) REFERENCES `matricula_turma` (`id_matricula`) ON DELETE CASCADE,
  CONSTRAINT `boletim_nota_ibfk_2` FOREIGN KEY (`id_materia`) REFERENCES `materia` (`id_materia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boletim_nota`
--

LOCK TABLES `boletim_nota` WRITE;
/*!40000 ALTER TABLE `boletim_nota` DISABLE KEYS */;
/*!40000 ALTER TABLE `boletim_nota` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cadastro_jovem`
--

DROP TABLE IF EXISTS `cadastro_jovem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cadastro_jovem` (
  `id_jovem` int NOT NULL AUTO_INCREMENT,
  `id_inscricao` int DEFAULT NULL,
  `matricula` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `inativo` char(1) COLLATE utf8mb4_unicode_ci DEFAULT 'N',
  `data_cadastro` date DEFAULT NULL,
  `nome_completo` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nome_social` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cpf` varchar(14) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rg` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orgao_emissor` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_emissao_rg` date DEFAULT NULL,
  `genero` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orientacao_sexual` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nascimento` date DEFAULT NULL,
  `idade_calculada` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `naturalidade` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nacionalidade` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Brasileira',
  `estado_civil` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cor_raca` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `destro_canhoto` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pcd` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT 'Não',
  `deficiencia_descricao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reservista` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cnh` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_cnh` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nis_pis` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ctps_numero` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ctps_serie` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banco` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agencia` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `conta` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cep` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `endereco` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `complemento` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bairro` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `municipio` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `regiao` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `celular` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recado` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `outros_fones` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `escolaridade` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `escola` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `periodo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serie` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ra` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fundacao` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cras` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `antecedentes` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ja_trabalhou` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT 'Não',
  `ctps_assinada` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT 'Não',
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
  `aprovacao_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Em Análise',
  `prova_data` date DEFAULT NULL,
  `prova_horario` time DEFAULT NULL,
  `prova_sala` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cad_unico` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT 'Não',
  `observacoes_sociais` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id_jovem`),
  UNIQUE KEY `matricula` (`matricula`),
  UNIQUE KEY `cpf` (`cpf`),
  KEY `id_inscricao` (`id_inscricao`),
  CONSTRAINT `cadastro_jovem_ibfk_1` FOREIGN KEY (`id_inscricao`) REFERENCES `inscricao_2026` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cadastro_jovem`
--

LOCK TABLES `cadastro_jovem` WRITE;
/*!40000 ALTER TABLE `cadastro_jovem` DISABLE KEYS */;
INSERT INTO `cadastro_jovem` VALUES (1,5,NULL,'N','2026-04-27','Maria Silva',NULL,'369258147','741852963',NULL,NULL,'Feminino',NULL,'2010-10-10',NULL,'brasileiro','Brasileira','Solteiro','Branco','Destro','Não','',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'13.036-225','R. Pedro V Boas','190','','JD Amanda 2 ','Campinas',NULL,'maria@hotmail.com','3654972','',NULL,NULL,'Ensino fundamental','EE Campinas ','manha','8 ano','20500',NULL,'20300',NULL,'sim','Sim',0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00,'Aprovado',NULL,NULL,NULL,'Não',NULL);
/*!40000 ALTER TABLE `cadastro_jovem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curso`
--

DROP TABLE IF EXISTS `curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curso` (
  `id_curso` int NOT NULL AUTO_INCREMENT,
  `nome_curso` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_curso` enum('Oficina de Formação','Jovem Aprendiz','Extracurricular') COLLATE utf8mb4_unicode_ci NOT NULL,
  `carga_horaria` int DEFAULT NULL,
  PRIMARY KEY (`id_curso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curso`
--

LOCK TABLES `curso` WRITE;
/*!40000 ALTER TABLE `curso` DISABLE KEYS */;
/*!40000 ALTER TABLE `curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inscricao_2026`
--

DROP TABLE IF EXISTS `inscricao_2026`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inscricao_2026` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome_completo` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cpf` varchar(14) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rg` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nis` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sexo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `naturalidade` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `estado_civil` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cor_raca` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `destro_canhoto` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `socio_assistencial` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ref_cras` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_deficiente` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT 'Não',
  `deficiencia_descricao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `projeto` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `escola_status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `escola_nome` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `escola_escolaridade` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `escola_periodo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `escola_serie` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `escola_ra` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_cep` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_logradouro` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_numero` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_complemento` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_bairro` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_cidade` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mora_com_pais` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mora_com_quem` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qtd_pessoas_residencia` int DEFAULT NULL,
  `tipo_moradia` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_construcao` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ja_trabalhou` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Não',
  `ctps_assinada` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `outras_rendas` decimal(10,2) DEFAULT NULL,
  `telefone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tel_contato` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tel_comercial` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `recebe_beneficio` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Não',
  `beneficio_nome` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `beneficio_valor` decimal(10,2) DEFAULT NULL,
  `status_processo` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'Pendente',
  `id_turma` int DEFAULT NULL,
  `data_cadastro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscricao_2026`
--

LOCK TABLES `inscricao_2026` WRITE;
/*!40000 ALTER TABLE `inscricao_2026` DISABLE KEYS */;
INSERT INTO `inscricao_2026` VALUES (1,'Paulo Cesar de Oliveira','111.111.111-11','46.051.234-90','90902020','Masculino','brasileiro','1987-12-27','Casado','Pardo','Destro','não','não','Não','','programação','paulo.oliveira@patrulheiros.org.br','ativo','EE Emanuel Bandeira','Ensino fundamental','manha','noite','333','13.036-225','R. Pedro V Boas','190','','JD Amanda 2 ','Campinas','Sim','familiares',3,'própria ','Alvenaria','S','Sim',0.00,'3654972','','','n','',0.00,'1',0,'2026-04-25 01:42:55'),(3,'João Paulo','123.456.789-10','12.123.456-78','203040','Masculino','brasileiro','2010-10-10','Solteiro','Negro','Destro','não','20300','Não','','Campinas Aprendiz','joao.paulo@patrulheiros.org.br','ativo','EE Campinas ','Ensino fundamental','manha','8 ano','20500','12188-172','R. Pedro V Boas','190','','JD Amanda 2 ','Campinas','Sim','familiares',3,'própria ','Alvenaria','S','Sim',0.00,'3232-4569','','','n','',0.00,'1',0,'2026-04-26 20:06:44'),(4,'Luana Batista','4987456321','123456789','159753','Feminino','brasileira','2010-10-10','Solteiro','Pardo','Canhoto','não','','Não','','Campinas Aprendiz','luana@gmail.com','ativo','EE Campinas ','Ensino fundamental','manha','8 ano','20500','13.036-225','R. Pedro V Boas','190','','JD Amanda 2 ','Campinas','Sim','familiares',3,'própria ','Alvenaria','sim','Não',0.00,'3654972','','','n','',0.00,'1',0,'2026-04-27 10:41:05'),(5,'Maria Silva','369258147','741852963','654789','Feminino','brasileiro','2010-10-10','Solteiro','Branco','Destro','não','20300','Não','','Campinas Aprendiz','maria@hotmail.com','ativo','EE Campinas ','Ensino fundamental','manha','8 ano','20500','13.036-225','R. Pedro V Boas','190','','JD Amanda 2 ','Campinas','Sim','familiares',3,'própria ','Alvenaria','sim','Sim',0.00,'3654972','','','n','',0.00,'Aprovado',0,'2026-04-27 12:07:03');
/*!40000 ALTER TABLE `inscricao_2026` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `trg_espelha_inscricao` AFTER UPDATE ON `inscricao_2026` FOR EACH ROW BEGIN
    
    IF NEW.status_processo = 'Aprovado' AND OLD.status_processo <> 'Aprovado' THEN
        INSERT INTO cadastro_jovem (
            id_inscricao,
            nome_completo,
            cpf,
            rg,
            genero,
            naturalidade,
            nascimento,
            estado_civil,
            cor_raca,
            destro_canhoto,
            pcd,
            deficiencia_descricao,
            email,
            telefone,
            celular,
            cep,
            endereco,
            numero,
            complemento,
            bairro,
            municipio,
            escolaridade,
            escola,
            periodo,
            serie,
            ra,
            cras,
            ja_trabalhou,
            ctps_assinada,
            data_cadastro,
            aprovacao_status
        )
        VALUES (
            NEW.id,
            NEW.nome_completo,
            NEW.cpf,
            NEW.rg,
            NEW.sexo,             
            NEW.naturalidade,
            NEW.data_nascimento,  
            NEW.estado_civil,
            NEW.cor_raca,
            NEW.destro_canhoto,
            NEW.is_deficiente,    
            NEW.deficiencia_descricao,
            NEW.email,
            NEW.telefone,
            NEW.tel_contato,      
            NEW.end_cep,          
            NEW.end_logradouro,   
            NEW.end_numero,       
            NEW.end_complemento,  
            NEW.end_bairro,       
            NEW.end_cidade,       
            NEW.escola_escolaridade,
            NEW.escola_nome,
            NEW.escola_periodo,
            NEW.escola_serie,
            NEW.escola_ra,
            NEW.ref_cras,         
            NEW.ja_trabalhou,
            NEW.ctps_assinada,
            NOW(),
            'Aprovado'
        );
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `inscricao_familia`
--

DROP TABLE IF EXISTS `inscricao_familia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inscricao_familia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_inscricao` int DEFAULT NULL,
  `parentesco` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nome_parente` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cpf_parente` varchar(14) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salario_parente` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_inscricao` (`id_inscricao`),
  CONSTRAINT `inscricao_familia_ibfk_1` FOREIGN KEY (`id_inscricao`) REFERENCES `inscricao_2026` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inscricao_familia`
--

LOCK TABLES `inscricao_familia` WRITE;
/*!40000 ALTER TABLE `inscricao_familia` DISABLE KEYS */;
/*!40000 ALTER TABLE `inscricao_familia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materia`
--

DROP TABLE IF EXISTS `materia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materia` (
  `id_materia` int NOT NULL AUTO_INCREMENT,
  `nome_materia` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_materia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materia`
--

LOCK TABLES `materia` WRITE;
/*!40000 ALTER TABLE `materia` DISABLE KEYS */;
/*!40000 ALTER TABLE `materia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matricula_turma`
--

DROP TABLE IF EXISTS `matricula_turma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matricula_turma` (
  `id_matricula` int NOT NULL AUTO_INCREMENT,
  `id_jovem` int NOT NULL,
  `id_turma` int NOT NULL,
  `data_matricula` date NOT NULL,
  `status_matricula` enum('Cursando','Concluído','Desistente','Reprovado') COLLATE utf8mb4_unicode_ci DEFAULT 'Cursando',
  `observacoes` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id_matricula`),
  KEY `id_jovem` (`id_jovem`),
  KEY `id_turma` (`id_turma`),
  CONSTRAINT `matricula_turma_ibfk_1` FOREIGN KEY (`id_jovem`) REFERENCES `cadastro_jovem` (`id_jovem`) ON DELETE CASCADE,
  CONSTRAINT `matricula_turma_ibfk_2` FOREIGN KEY (`id_turma`) REFERENCES `turma` (`id_turma`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matricula_turma`
--

LOCK TABLES `matricula_turma` WRITE;
/*!40000 ALTER TABLE `matricula_turma` DISABLE KEYS */;
/*!40000 ALTER TABLE `matricula_turma` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turma`
--

DROP TABLE IF EXISTS `turma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turma` (
  `id_turma` int NOT NULL AUTO_INCREMENT,
  `id_curso` int NOT NULL,
  `codigo_turma` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_inicio` date DEFAULT NULL,
  `data_fim` date DEFAULT NULL,
  PRIMARY KEY (`id_turma`),
  KEY `id_curso` (`id_curso`),
  CONSTRAINT `turma_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turma`
--

LOCK TABLES `turma` WRITE;
/*!40000 ALTER TABLE `turma` DISABLE KEYS */;
/*!40000 ALTER TABLE `turma` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'erp_aprendiz'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-27 16:45:08
