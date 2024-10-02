import { Request, Response } from 'express';
import db from '../db/knex';

class TelegramGroupsController {
  // Add a new group
  async addGroup(req: Request, res: Response): Promise<void> {
    const { group_name, group_link } = req.body;

    if (!group_name || !group_link) {
      res.status(400).json({ error: 'Group name and link are required' });
      return;
    }

    try {
      const [groupId] = await db('telegram_groups').insert({
        group_name,
        group_link,
      }).returning('id');

      res.status(201).json({ message: 'Group added', groupId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add group' });
    }
  }

  // Get all groups
  async getGroups(req: Request, res: Response): Promise<void> {
    try {
      const groups = await db('telegram_groups').select('*');
      res.status(200).json(groups);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve groups' });
    }
  }

  // Get a single group by ID
  async getGroupById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const group = await db('telegram_groups').where({ id }).first();

      if (!group) {
        res.status(404).json({ error: 'Group not found' });
        return;
      }

      res.status(200).json(group);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve group' });
    }
  }

  // Update a group by ID
  async updateGroup(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { group_name, group_link } = req.body;

    if (!group_name || !group_link) {
      res.status(400).json({ error: 'Group name and link are required' });
      return;
    }

    try {
      const updated = await db('telegram_groups').where({ id }).update({
        group_name,
        group_link,
      });

      if (!updated) {
        res.status(404).json({ error: 'Group not found' });
        return;
      }

      res.status(200).json({ message: 'Group updated' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update group' });
    }
  }

  // Delete a group by ID
  async deleteGroup(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      const deleted = await db('telegram_groups').where({ id }).del();

      if (!deleted) {
        res.status(404).json({ error: 'Group not found' });
        return;
      }

      res.status(200).json({ message: 'Group deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to delete group' });
    }
  }
}

export default new TelegramGroupsController();
