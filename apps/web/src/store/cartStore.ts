import { create } from 'zustand';
import { CartItem, Product } from '@/types';
import { api } from '@/lib/api';

export interface CartState {
  cartItems: CartItem[];
  fetchCart: () => Promise<void>;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartItemQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cartItems: [],

  fetchCart: async () => {
    try {
      const { data } = await api.get<{ data: CartItem[] }>('/cart');
      set({ cartItems: data || [] });
    } catch (err) {
      console.error('Failed to fetch cart', err);
    }
  },

  addToCart: async (product, quantity) => {
    const { cartItems } = get();
    const existingItemIndex = cartItems.findIndex((item) => item.productId === product.id);
    let updatedItems = [...cartItems];

    if (existingItemIndex >= 0) {
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
      };
    } else {
      updatedItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity,
      });
    }

    try {
      await api.post('/cart', { items: updatedItems });
      set({ cartItems: updatedItems });
    } catch (err) {
      console.error('Failed to update cart', err);
    }
  },

  removeFromCart: async (productId) => {
    const { cartItems } = get();
    const updatedItems = cartItems.filter((item) => item.productId !== productId);
    
    try {
      await api.post('/cart', { items: updatedItems });
      set({ cartItems: updatedItems });
    } catch (err) {
      console.error('Failed to remove from cart', err);
    }
  },

  updateCartItemQuantity: async (productId, quantity) => {
    const { cartItems } = get();
    const updatedItems = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    
    try {
      await api.post('/cart', { items: updatedItems });
      set({ cartItems: updatedItems });
    } catch (err) {
      console.error('Failed to update quantity', err);
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart');
      set({ cartItems: [] });
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  },

  getCartTotal: () => {
    const { cartItems } = get();
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getCartItemCount: () => {
    const { cartItems } = get();
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  },
}));