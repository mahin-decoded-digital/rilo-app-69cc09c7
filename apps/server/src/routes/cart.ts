import { Router } from 'express';
import { db } from '../lib/db';
import type { Request, Response } from 'express';

const router = Router();
const carts = db.collection('carts');

router.get('/', async (req: Request, res: Response) => {
  try {
    const cartId = req.headers['x-cart-id'] as string;
    if (!cartId) return res.status(400).json({ error: 'Missing X-Cart-Id header' });
    
    const allCarts = await carts.find();
    const cart = allCarts.find(c => c.cartId === cartId);
    
    res.json({ data: cart ? cart.items : [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const cartId = req.headers['x-cart-id'] as string;
    if (!cartId) return res.status(400).json({ error: 'Missing X-Cart-Id header' });
    
    const { items } = req.body;
    
    const allCarts = await carts.find();
    const cart = allCarts.find(c => c.cartId === cartId);
    
    if (cart) {
      await carts.updateOne(cart._id as string, { items });
    } else {
      await carts.insertOne({ cartId, items });
    }
    
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/', async (req: Request, res: Response) => {
  try {
    const cartId = req.headers['x-cart-id'] as string;
    if (!cartId) return res.status(400).json({ error: 'Missing X-Cart-Id header' });
    
    const allCarts = await carts.find();
    const cart = allCarts.find(c => c.cartId === cartId);
    
    if (cart) {
      await carts.deleteOne(cart._id as string);
    }
    
    res.json({ data: { success: true } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;