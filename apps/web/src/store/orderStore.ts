import { create } from 'zustand';
import { Order, CartItem, Address, OrderStatus } from '@/types';
import { api } from '@/lib/api';

export interface OrderState {
  orders: Order[];
  fetchOrders: () => Promise<void>;
  placeOrder: (userId: string, items: CartItem[], totalAmount: number, shippingAddress: Address) => Promise<Order>;
  fetchUserOrders: (userId: string) => Order[];
  fetchAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  
  fetchOrders: async () => {
    try {
      const { data } = await api.get<{ data: Order[] }>('/orders');
      set({ orders: data || [] });
    } catch (err) {
      console.error('Failed to fetch orders', err);
      set({ orders: [] });
    }
  },
  
  placeOrder: async (userId, items, totalAmount, shippingAddress) => {
    const orderData = {
      userId,
      items,
      totalAmount,
      shippingAddress,
      status: 'pending',
      orderDate: new Date().toISOString(),
    };

    const { data } = await api.post<{ data: Order }>('/orders', orderData);
    
    set((state) => ({
      orders: [...(state.orders || []), data],
    }));
    
    return data;
  },
  
  fetchUserOrders: (userId) => {
    return (get().orders || []).filter((order) => order.userId === userId);
  },
  
  fetchAllOrders: () => {
    return get().orders || [];
  },
  
  updateOrderStatus: async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}`, { status });
      const { data } = await api.get<{ data: Order[] }>('/orders');
      set({ orders: data || [] });
    } catch (err) {
      console.error('Failed to update order status', err);
    }
  },
}));