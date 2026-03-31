import { Router } from 'express';
import { db } from '../lib/db';
import type { Request, Response } from 'express';

const router = Router();
const users = db.collection('users');

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const allUsers = await users.find();
    const user = allUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    res.json({ data: { user, token: user.id } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const allUsers = await users.find();
    
    if (allUsers.some(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
      address: { street: '', city: '', state: '', zip: '', country: '' },
      role: 'user',
    };
    
    await users.insertOne(newUser);
    res.json({ data: { user: newUser, token: newUser.id } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    
    const allUsers = await users.find();
    const user = allUsers.find(u => u.id === token);
    
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    
    res.json({ data: user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;