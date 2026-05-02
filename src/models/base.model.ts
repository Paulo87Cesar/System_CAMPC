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

  static async insert(table: string, data: Record<string, any>) {
    const [result] = await pool.query(`INSERT INTO ${table} SET ?`, [data]);
    return result;
  }

  static async update(table: string, idCol: string, id: number, data: Record<string, any>) {
    const [result] = await pool.query(`UPDATE ${table} SET ? WHERE ${idCol} = ?`, [data, id]);
    return result;
  }

  static async remove(table: string, idCol: string, id: number) {
    const [result] = await pool.query(`DELETE FROM ${table} WHERE ${idCol} = ?`, [id]);
    return result;
  }
}
