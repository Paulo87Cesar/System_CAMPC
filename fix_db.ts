import pool from './src/config/database';

async function checkDb() {
  try {
    const [aula] = await pool.query("SHOW TABLES LIKE 'aula'") as any[];
    console.log('Tabela aula:', aula.length > 0 ? 'Existe' : 'Nao existe');
    
    const [cols] = await pool.query("SHOW COLUMNS FROM frequencia") as any[];
    const hasObs = cols.some((c: any) => c.Field === 'observacao_individual');
    const hasAula = cols.some((c: any) => c.Field === 'id_aula');
    console.log('frequencia.observacao_individual:', hasObs ? 'Existe' : 'Nao existe');
    console.log('frequencia.id_aula:', hasAula ? 'Existe' : 'Nao existe');
    
    // Se a tabela aula não existe, vamos criar
    if (aula.length === 0) {
      console.log('Criando tabela aula...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS \`aula\` (
          \`id_aula\` INT NOT NULL AUTO_INCREMENT,
          \`id_turma\` INT NOT NULL,
          \`data_aula\` DATE NOT NULL,
          \`periodo\` ENUM('Manhã','Tarde','Noite') DEFAULT NULL,
          \`id_educador\` INT DEFAULT NULL,
          \`conteudo_ministrado\` TEXT DEFAULT NULL,
          \`observacoes_gerais\` TEXT DEFAULT NULL,
          \`criado_em\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (\`id_aula\`),
          UNIQUE KEY \`uq_aula_turma_data\` (\`id_turma\`, \`data_aula\`),
          CONSTRAINT \`fk_aula_turma\` FOREIGN KEY (\`id_turma\`) REFERENCES \`turma\` (\`id_turma\`) ON DELETE CASCADE ON UPDATE CASCADE,
          CONSTRAINT \`fk_aula_educador\` FOREIGN KEY (\`id_educador\`) REFERENCES \`educador\` (\`id_educador\`) ON DELETE SET NULL ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
      console.log('Tabela aula criada com sucesso.');
    }
    
    // Se a coluna id_aula não existe, vamos adicionar
    if (!hasAula) {
      console.log('Adicionando coluna id_aula na tabela frequencia...');
      await pool.query(`
        ALTER TABLE \`frequencia\`
        ADD COLUMN \`id_aula\` INT DEFAULT NULL AFTER \`id\`,
        ADD CONSTRAINT \`fk_freq_aula\` FOREIGN KEY (\`id_aula\`) REFERENCES \`aula\` (\`id_aula\`) ON DELETE CASCADE ON UPDATE CASCADE;
      `);
      console.log('Coluna id_aula adicionada com sucesso.');
    }

    // Verificar colunas de ocorrencia
    const [ocorrCols] = await pool.query("SHOW COLUMNS FROM ocorrencia") as any[];
    const hasCriadoPor = ocorrCols.some((c: any) => c.Field === 'criado_por');
    console.log('ocorrencia.criado_por:', hasCriadoPor ? 'Existe' : 'Nao existe');

    if (!hasCriadoPor) {
      console.log('Adicionando coluna criado_por na tabela ocorrencia...');
      await pool.query(`
        ALTER TABLE \`ocorrencia\`
        ADD COLUMN \`criado_por\` VARCHAR(150) DEFAULT NULL AFTER \`descricao\`;
      `);
      console.log('Coluna criado_por adicionada com sucesso.');
    }
    
    console.log('Verificação e correção do banco finalizada.');
  } catch (err) {
    console.error('Erro:', err);
  } finally {
    process.exit();
  }
}

checkDb();
