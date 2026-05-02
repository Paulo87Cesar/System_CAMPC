import pool from '../config/database';
import { Jovem } from '../types/jovem';

export class JovemModel {
  static async getAll(): Promise<Jovem[]> {
    const [rows] = await pool.query('SELECT * FROM cadastro_jovem');
    return rows as Jovem[];
  }

  static async getById(id: number): Promise<Jovem | null> {
    const [rows] = await pool.query('SELECT * FROM cadastro_jovem WHERE id_jovem = ?', [id]);
    const jovens = rows as Jovem[];
    if (jovens.length > 0) {
      return jovens[0];
    }
    return null;
  }

  static async create(jovem: Jovem): Promise<any> {
    const [result] = await pool.query('INSERT INTO cadastro_jovem SET ?', [jovem]);
    return result;
  }

  static async update(id: number, jovem: Partial<Jovem>): Promise<any> {
    const [result] = await pool.query('UPDATE cadastro_jovem SET ? WHERE id_jovem = ?', [jovem, id]);
    return result;
  }

  static async delete(id: number): Promise<any> {
    const [result] = await pool.query('DELETE FROM cadastro_jovem WHERE id_jovem = ?', [id]);
    return result;
  }
}
