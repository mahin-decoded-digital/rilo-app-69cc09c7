import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CartItemCardProps {
  item: CartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const updateCartItemQuantity = useCartStore((s) => s.updateCartItemQuantity);
  const removeFromCart = useCartStore((s) => s.removeFromCart);

  const handleRemove = () => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      removeFromCart(item.productId);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) {
      updateCartItemQuantity(item.productId, val);
    }
  };

  const increment = () => updateCartItemQuantity(item.productId, item.quantity + 1);
  const decrement = () => updateCartItemQuantity(item.productId, Math.max(1, item.quantity - 1));

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-24 h-24 shrink-0 bg-muted rounded-md overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          <Link to={`/products/${item.productId}`} className="hover:underline">
            <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
          </Link>
          <p className="text-muted-foreground mt-1">${item.price.toFixed(2)}</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={decrement}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="w-16 h-8 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min={1}
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={increment}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0 min-w-[100px]">
          <p className="font-bold text-lg">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}