import { Router } from 'express';
import { db } from '../lib/db';
import type { Request, Response } from 'express';

const router = Router();
const orders = db.collection('orders');

router.get('/', async (req: Request, res: Response) => {
  try {
    const allOrders = await orders.find();
    res.json({ data: allOrders });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const newOrder = {
      ...req.body,
      id: req.body.id || crypto.randomUUID(),
      orderDate: req.body.orderDate || new Date().toISOString(),
      status: req.body.status || 'pending',
    };
    await orders.insertOne(newOrder);
    res.json({ data: newOrder });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const allOrders = await orders.find();
    const order = allOrders.find(o => o.id === id);
    if (!order) return res.status(404).json({ error: 'Not found' });
    
    await orders.updateOne(order._id as string, req.body);
    res.json({ data: { ...order, ...req.body } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;