import { create } from 'zustand';
import { Product, Category } from '@/types';
import { api } from '@/lib/api';

export interface FilterOptions {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  search?: string;
}

export type SortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest';

export interface ProductState {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (categoryName: string) => Product[];
  getFilteredAndSortedProducts: (filters: FilterOptions, sort: SortOption) => Product[];
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  categories: [],
  isLoading: false,
  error: '',

  fetchProducts: async () => {
    set({ isLoading: true, error: '' });
    try {
      const { data } = await api.get<{ data: Product[] }>('/products');
      set({ products: data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false, products: [] });
    }
  },

  fetchCategories: async () => {
    try {
      const { data } = await api.get<{ data: Category[] }>('/categories');
      set({ categories: data || [] });
    } catch (err) {
      console.error('Failed to fetch categories', err);
      set({ categories: [] });
    }
  },

  addProduct: async (product) => {
    try {
      await api.post('/products', product);
      const { data } = await api.get<{ data: Product[] }>('/products');
      set({ products: data || [] });
    } catch (err) {
      console.error('Failed to add product', err);
    }
  },

  updateProduct: async (id, updates) => {
    try {
      await api.put(`/products/${id}`, updates);
      const { data } = await api.get<{ data: Product[] }>('/products');
      set({ products: data || [] });
    } catch (err) {
      console.error('Failed to update product', err);
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`/products/${id}`);
      const { data } = await api.get<{ data: Product[] }>('/products');
      set({ products: data || [] });
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  },

  getProductById: (id) => {
    return (get().products || []).find((p) => p.id === id);
  },

  getProductsByCategory: (categoryName) => {
    return (get().products || []).filter((p) => p.category === categoryName);
  },

  getFilteredAndSortedProducts: (filters, sort) => {
    let result = [...(get().products || [])];

    if (filters.categories && filters.categories.length > 0) {
      result = result.filter((p) => filters.categories?.includes(p.category));
    }

    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.price >= (filters.minPrice ?? 0));
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= (filters.maxPrice ?? Infinity));
    }

    if (filters.brands && filters.brands.length > 0) {
      result = result.filter((p) => filters.brands?.includes(p.brand));
    }

    if (filters.search) {
      const lowerSearch = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerSearch) ||
          p.description.toLowerCase().includes(lowerSearch)
      );
    }

    result.sort((a, b) => {
      switch (sort) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'newest':
        default:
          return 0;
      }
    });

    return result;
  },
}));