import { create } from 'zustand';
import { User } from '@/types';
import { api } from '@/lib/api';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: User[];
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => void;
  setCurrentUser: (user: User) => Promise<void>;
  updateUserRole: (userId: string, role: 'user' | 'admin') => Promise<void>;
  checkAuth: () => Promise<void>;
  isAdmin: () => boolean;
  fetchUsers: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  users: [],

  login: async (email, password) => {
    const { data } = await api.post<{ data: { user: User, token: string } }>('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    set({ user: data.user, isAuthenticated: true });
  },

  register: async (name, email, password) => {
    const { data } = await api.post<{ data: { user: User, token: string } }>('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    set({ user: data.user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },

  setCurrentUser: async (updatedUser) => {
    await api.put(`/users/${updatedUser.id}`, updatedUser);
    const { data } = await api.get<{ data: User[] }>('/users');
    set({
      user: updatedUser,
      users: data,
    });
  },

  updateUserRole: async (userId, role) => {
    await api.put(`/users/${userId}`, { role });
    const { data } = await api.get<{ data: User[] }>('/users');
    const { user } = get();
    set({
      users: data,
      user: user?.id === userId ? { ...user, role } : user,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    try {
      const { data } = await api.get<{ data: User }>('/auth/me');
      set({ user: data, isAuthenticated: true });
    } catch (err) {
      localStorage.removeItem('token');
      set({ isAuthenticated: false, user: null });
    }
  },

  isAdmin: () => {
    const { user } = get();
    return user?.role === 'admin';
  },

  fetchUsers: async () => {
    try {
      const { data } = await api.get<{ data: User[] }>('/users');
      set({ users: data });
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  }
}));