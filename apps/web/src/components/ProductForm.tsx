import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types';
import { useProductStore } from '@/store/productStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface ProductFormProps {
  initialData?: Product;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const navigate = useNavigate();
  
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const categories = useProductStore((s) => s.categories);
  const fetchCategories = useProductStore((s) => s.fetchCategories);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    imageUrl: initialData?.imageUrl || '',
    category: initialData?.category || '',
    stock: initialData?.stock?.toString() || '',
    brand: initialData?.brand || ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { name, description, price, imageUrl, category, stock, brand } = formData;

    if (!name.trim() || !description.trim() || !price || !imageUrl.trim() || !category || !stock || !brand.trim()) {
      setError('All fields are required');
      return;
    }

    const numPrice = parseFloat(price);
    const numStock = parseInt(stock, 10);

    if (isNaN(numPrice) || numPrice <= 0) {
      setError('Price must be a valid positive number');
      return;
    }

    if (isNaN(numStock) || numStock < 0) {
      setError('Stock must be a valid non-negative integer');
      return;
    }

    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: numPrice,
      imageUrl: imageUrl.trim(),
      category,
      stock: numStock,
      brand: brand.trim()
    };

    try {
      if (initialData?.id) {
        updateProduct(initialData.id, productData);
      } else {
        addProduct(productData);
      }
      navigate('/admin/products');
    } catch (err) {
      setError('An error occurred while saving the product. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && (
        <div className="p-3 text-sm font-medium text-destructive-foreground bg-destructive/90 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="e.g. Classic White T-Shirt"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input 
            id="brand" 
            name="brand" 
            value={formData.brand} 
            onChange={handleChange} 
            placeholder="e.g. BasicWear"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input 
            id="price" 
            name="price" 
            type="number" 
            step="0.01" 
            min="0.01"
            value={formData.price} 
            onChange={handleChange} 
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input 
            id="stock" 
            name="stock" 
            type="number" 
            min="0"
            step="1"
            value={formData.stock} 
            onChange={handleChange} 
            placeholder="0"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {(categories ?? []).map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input 
            id="imageUrl" 
            name="imageUrl" 
            type="url"
            value={formData.imageUrl} 
            onChange={handleChange} 
            placeholder="https://placehold.co/400x400"
            required
          />
          {formData.imageUrl && (
            <div className="mt-2 text-xs text-muted-foreground">
              Preview:
              <img 
                src={formData.imageUrl} 
                alt="Preview" 
                className="mt-1 h-20 w-20 object-cover rounded border"
                onError={(e) => (e.currentTarget.style.display = 'none')}
                onLoad={(e) => (e.currentTarget.style.display = 'block')}
              />
            </div>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="Detailed product description..."
            rows={4}
            required
            className="resize-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-4 border-t">
        <Button variant="outline" type="button" onClick={() => navigate('/admin/products')}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Save Changes' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}