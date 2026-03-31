import React, { useMemo } from 'react';
import { useProductStore, FilterOptions } from '@/store/productStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  className?: string;
}

export default function FilterSidebar({ filters, onFilterChange, className = '' }: FilterSidebarProps) {
  const categories = useProductStore(s => s.categories);
  const products = useProductStore(s => s.products);

  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    (products ?? []).forEach(p => brands.add(p.brand));
    return Array.from(brands).sort();
  }, [products]);

  const handleCategoryToggle = (categoryName: string, checked: boolean) => {
    const currentCategories = filters.categories || [];
    let newCategories: string[];
    
    if (checked) {
      newCategories = [...currentCategories, categoryName];
    } else {
      newCategories = currentCategories.filter(c => c !== categoryName);
    }
    
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleBrandToggle = (brandName: string, checked: boolean) => {
    const currentBrands = filters.brands || [];
    let newBrands: string[];
    
    if (checked) {
      newBrands = [...currentBrands, brandName];
    } else {
      newBrands = currentBrands.filter(b => b !== brandName);
    }
    
    onFilterChange({ ...filters, brands: newBrands });
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    onFilterChange({ ...filters, [field]: numValue });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleClearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs h-8 text-muted-foreground"
          onClick={handleClearFilters}
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Search</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-9"
            value={filters.search || ''}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Categories
        </Label>
        <div className="space-y-3">
          {(categories ?? []).map((cat) => (
            <div key={cat.id} className="flex items-center justify-between">
              <Label htmlFor={`cat-${cat.id}`} className="text-sm font-normal cursor-pointer flex-1">
                {cat.name}
              </Label>
              <Switch
                id={`cat-${cat.id}`}
                checked={(filters.categories || []).includes(cat.name)}
                onCheckedChange={(checked) => handleCategoryToggle(cat.name, checked)}
              />
            </div>
          ))}
          {(categories ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground italic">No categories found.</p>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Price Range
        </Label>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="Min $"
            min="0"
            value={filters.minPrice ?? ''}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            className="w-full"
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max $"
            min="0"
            value={filters.maxPrice ?? ''}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Brands
        </Label>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted">
          {availableBrands.map((brand) => (
            <div key={brand} className="flex items-center justify-between">
              <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer flex-1 truncate pr-2" title={brand}>
                {brand}
              </Label>
              <Switch
                id={`brand-${brand}`}
                checked={(filters.brands || []).includes(brand)}
                onCheckedChange={(checked) => handleBrandToggle(brand, checked)}
              />
            </div>
          ))}
          {availableBrands.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No brands available.</p>
          )}
        </div>
      </div>
    </div>
  );
}