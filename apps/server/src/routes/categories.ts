import { Router } from 'express';
import { db } from '../lib/db';
import type { Request, Response } from 'express';

const router = Router();
const categories = db.collection('categories');

router.get('/', async (req: Request, res: Response) => {
  try {
    const allCategories = await categories.find();
    res.json({ data: allCategories });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;