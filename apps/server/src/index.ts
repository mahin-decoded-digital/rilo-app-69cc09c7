import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { db } from './lib/db'

import authRouter from './routes/auth'
import usersRouter from './routes/users'
import productsRouter from './routes/products'
import categoriesRouter from './routes/categories'
import ordersRouter from './routes/orders'
import cartRouter from './routes/cart'

const isProd = process.env.PROD === 'true'
console.log('[server] Environment:')
console.log('  PROD:', isProd ? '✓ true' : '✗ false (in-memory storage)')
console.log('  MONGODB_URI:', process.env.MONGODB_URI ? '✓ configured' : '✗ not set')
if (isProd && !process.env.MONGODB_URI) {
  console.warn('[server] ⚠ PROD=true but MONGODB_URI not set — falling back to in-memory!')
}

const app = express()
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001
app.use(cors({ origin: '*' }))
app.use(express.json())

app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    console.log(`[api] ${req.method} ${req.path} → ${res.statusCode} (${Date.now() - start}ms)`)
  })
  next()
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', db: db.isProduction() ? 'mongodb' : 'in-memory' })
})

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/cart', cartRouter)

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[server] Error:', err.message)
  res.status(500).json({ error: 'Internal server error' })
})

const initializeDb = async () => {
  if (!db.isProduction()) {
    // Seed default data for in-memory mode
    const users = db.collection('users');
    const existingUsers = await users.find();
    if (existingUsers.length === 0) {
      await users.insertOne({
        id: 'admin-123',
        email: process.env.VITE_ADMIN_EMAIL || 'admin@example.com',
        password: process.env.VITE_ADMIN_PASSWORD || 'password',
        name: 'System Admin',
        address: { street: '123 Admin Way', city: 'Techville', state: 'CA', zip: '90210', country: 'USA' },
        role: 'admin',
      });
    }

    const categories = db.collection('categories');
    const existingCategories = await categories.find();
    if (existingCategories.length === 0) {
      await categories.insertOne({ id: 'cat-1', name: 'Men', imageUrl: 'https://placehold.co/400x300/e2e8f0/1e293b?text=Men' });
      await categories.insertOne({ id: 'cat-2', name: 'Women', imageUrl: 'https://placehold.co/400x300/e2e8f0/1e293b?text=Women' });
      await categories.insertOne({ id: 'cat-3', name: 'Kids', imageUrl: 'https://placehold.co/400x300/e2e8f0/1e293b?text=Kids' });
    }

    const products = db.collection('products');
    const existingProducts = await products.find();
    if (existingProducts.length === 0) {
      await products.insertOne({
        id: 'prod-1', name: 'Classic White T-Shirt', description: 'A timeless classic white t-shirt made from 100% cotton.',
        price: 29.99, imageUrl: 'https://placehold.co/400x400/e2e8f0/1e293b?text=White+T-Shirt', category: 'Men', stock: 50, brand: 'BasicWear'
      });
      await products.insertOne({
        id: 'prod-2', name: 'Floral Summer Dress', description: 'Light and breezy floral dress perfect for summer days.',
        price: 49.99, imageUrl: 'https://placehold.co/400x400/e2e8f0/1e293b?text=Summer+Dress', category: 'Women', stock: 30, brand: 'Sunshine Style'
      });
      await products.insertOne({
        id: 'prod-3', name: 'Kids Denim Jeans', description: 'Durable and comfortable denim jeans for active kids.',
        price: 34.99, imageUrl: 'https://placehold.co/400x400/e2e8f0/1e293b?text=Kids+Jeans', category: 'Kids', stock: 40, brand: 'PlayTime'
      });
    }
  }
};

app.listen(PORT, async () => {
  await initializeDb();
  console.log(`[server] API server running on http://localhost:${PORT}`)
  console.log(`[server] DB mode: ${db.isProduction() ? 'MongoDB' : 'In-memory'}`)
})