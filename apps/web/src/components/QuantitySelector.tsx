import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  max?: number;
  disabled?: boolean;
}

export default function QuantitySelector({ quantity, onChange, max = 99, disabled = false }: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > 1 && !disabled) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max && !disabled) {
      onChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      if (val < 1) {
        onChange(1);
      } else if (val > max) {
        onChange(max);
      } else {
        onChange(val);
      }
    }
  };

  return (
    <div className="flex items-center max-w-[130px]">
      <Button 
        type="button"
        variant="outline" 
        size="sm" 
        className="h-9 w-9 p-0 rounded-r-none"
        onClick={handleDecrement}
        disabled={disabled || quantity <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <Input
        type="number"
        min={1}
        max={max}
        value={quantity}
        onChange={handleInputChange}
        disabled={disabled}
        className="h-9 w-14 rounded-none text-center text-sm border-x-0 focus-visible:ring-0 px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Quantity"
      />
      
      <Button 
        type="button"
        variant="outline" 
        size="sm" 
        className="h-9 w-9 p-0 rounded-l-none"
        onClick={handleIncrement}
        disabled={disabled || quantity >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}