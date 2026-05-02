import { Request, Response } from 'express';
import { JovemModel } from '../models/jovem.model';

export class JovemController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const jovens = await JovemModel.getAll();
      res.json(jovens);
    } catch (error) {
      console.error('Error getting jovens:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
      }
      const jovem = await JovemModel.getById(id);
      if (jovem) {
        res.json(jovem);
      } else {
        res.status(404).json({ message: 'Jovem not found' });
      }
    } catch (error) {
      console.error('Error getting jovem by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await JovemModel.create(req.body);
      res.status(201).json({ id_jovem: result.insertId, ...req.body });
    } catch (error) {
      console.error('Error creating jovem:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
      }
      await JovemModel.update(id, req.body);
      res.json({ message: 'Jovem updated successfully' });
    } catch (error) {
      console.error('Error updating jovem:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string, 10);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
      }
      await JovemModel.delete(id);
      res.json({ message: 'Jovem deleted successfully' });
    } catch (error) {
      console.error('Error deleting jovem:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
