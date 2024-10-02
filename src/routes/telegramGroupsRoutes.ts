import { Router } from 'express';
import TelegramGroupsController from '../controllers/TelegramGroupsController';

const router = Router();

// Add a new Telegram group
router.post('/groups', TelegramGroupsController.addGroup);

// Get all Telegram groups
router.get('/groups', TelegramGroupsController.getGroups);

// Get a specific Telegram group by ID
router.get('/groups/:id', TelegramGroupsController.getGroupById);

// Update a Telegram group by ID
router.put('/groups/:id', TelegramGroupsController.updateGroup);

// Delete a Telegram group by ID
router.delete('/groups/:id', TelegramGroupsController.deleteGroup);

export default router;
