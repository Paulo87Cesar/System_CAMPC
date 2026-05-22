import pool from '../config/database';

export class BaseModel {
  static async findAll(table: string, where?: string, params?: any[]) {
    const sql = `SELECT * FROM ${table}${where ? ' WHERE ' + where : ''}`;
    const [rows] = await pool.query(sql, params);
    return rows;
  }

  static async findById(table: string, idCol: string, id: number) {
    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE ${idCol} = ?`, [id]) as any[];
    return (rows as any[])[0] || null;
  }

  // Lista de campos que vêm de JOINs e não devem ser salvos nas tabelas
    private static VIRTUAL_FIELDS = [
      'nome_curso', 'nome_educador', 'nome_jovem', 'nome_empresa', 
      'nome_projeto', 'nome_programa', 'matricula_jovem', 'matricula_aluno',
      'codigo_turma', 'matricula_busca', 'periodo_turma', 'status_turma',
      'data_inicio_turma', 'data_fim_turma', 'modalidade_turma'
    ];

  private static cleanData(table: string, data: Record<string, any>) {
    const cleaned: Record<string, any> = {};
    for (const key in data) {
      if (table === 'matricula_turma' && key === 'matricula') { continue; }
      if (table === 'curso' && key === 'nome_curso') { cleaned[key] = data[key]; continue; }
      if (table === 'projeto' && key === 'nome_projeto') { cleaned[key] = data[key]; continue; }
      if (table === 'programa' && key === 'nome_programa') { cleaned[key] = data[key]; continue; }

      if (!this.VIRTUAL_FIELDS.includes(key)) {
        cleaned[key] = data[key];
      }
    }
    return cleaned;
  }

  static async insert(table: string, data: Record<string, any>) {
    const safeData = this.cleanData(table, data);
    const [result] = await pool.query(`INSERT INTO ${table} SET ?`, [safeData]);
    return result;
  }

  static async update(table: string, idCol: string, id: number, data: Record<string, any>) {
    const safeData = this.cleanData(table, data);
    const [result] = await pool.query(`UPDATE ${table} SET ? WHERE ${idCol} = ?`, [safeData, id]);
    return result;
  }

  static async remove(table: string, idCol: string, id: number) {
    const [result] = await pool.query(`DELETE FROM ${table} WHERE ${idCol} = ?`, [id]);
    return result;
  }
}
