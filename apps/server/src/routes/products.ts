import { Router } from 'express';
import { db } from '../lib/db';
import type { Request, Response } from 'express';

const router = Router();
const products = db.collection('products');

router.get('/', async (req: Request, res: Response) => {
  try {
    const allProducts = await products.find();
    res.json({ data: allProducts });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const newProduct = {
      ...req.body,
      id: req.body.id || crypto.randomUUID(),
    };
    await products.insertOne(newProduct);
    res.json({ data: newProduct });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const allProducts = await products.find();
    const product = allProducts.find(p => p.id === id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    
    await products.updateOne(product._id as string, req.body);
    res.json({ data: { ...product, ...req.body } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const allProducts = await products.find();
    const product = allProducts.find(p => p.id === id);
    if (!product) return res.status(404).json({ error: 'Not found' });
    
    await products.deleteOne(product._id as string);
    res.json({ data: { success: true } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;