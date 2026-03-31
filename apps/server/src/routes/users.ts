import { Router } from 'express';
import { db } from '../lib/db';
import type { Request, Response } from 'express';

const router = Router();
const users = db.collection('users');

router.get('/', async (req: Request, res: Response) => {
  try {
    const allUsers = await users.find();
    res.json({ data: allUsers });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string; // Explicitly cast id to string
    const updates = req.body;

    const success = await users.updateOne(id, updates);

    if (!success) {
      // If updateOne returned false, it means the user with that ID was not found.
      // We should return a 404.
      return res.status(404).json({ error: 'User not found' });
    }

    // After a successful update, fetch the updated user directly using findById
    const updatedUser = await users.findById(id);

    if (!updatedUser) {
      // This case should ideally not happen if updateOne returned true,
      // but it's good for robustness.
      return res.status(404).json({ error: 'User not found after update' });
    }

    res.json({ data: updatedUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;