import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((s) => s.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // In a real app, this would toggle the item in the user's wishlist
  };

  return (
    <div className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/40 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300 relative">
      <Link to={`/products/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-muted block">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.stock <= 0 && (
            <Badge variant="destructive" className="font-semibold shadow-sm px-3 py-1">
              Sold Out
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-background transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 shadow-sm"
          title="Add to Wishlist"
        >
          <Heart className="h-4 w-4" />
        </button>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <div>
            <div className="mb-1 text-xs font-semibold text-primary/80 uppercase tracking-wider">
              {product.brand}
            </div>
            <Link to={`/products/${product.id}`}>
              <h3 className="font-semibold text-base leading-tight line-clamp-2 text-foreground hover:text-primary transition-colors" title={product.name}>
                {product.name}
              </h3>
            </Link>
          </div>
          <span className="font-bold text-lg text-foreground shrink-0">
            ${product.price.toFixed(2)}
          </span>
        </div>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <Badge variant="secondary" className="font-normal text-xs bg-muted">
            {product.category}
          </Badge>
          <Button 
            size="sm"
            className="rounded-full shadow-sm hover:shadow-md transition-all"
            variant={product.stock <= 0 ? "secondary" : "default"}
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            <ShoppingCart className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">
              {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}