import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import QuantitySelector from '@/components/QuantitySelector';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { ArrowLeft, ShoppingCart, Truck, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const addToCart = useCartStore((s) => s.addToCart);

  useEffect(() => {
    if (!products || products.length === 0) {
      fetchProducts();
    }
  }, [products, fetchProducts]);

  const product = useMemo(() => {
    return (products ?? []).find((p) => p.id === id);
  }, [products, id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      // Could add toast notification here
      navigate('/cart');
    }
  };

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
            <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/products">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6 -ml-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-muted rounded-2xl overflow-hidden flex items-center justify-center p-8 aspect-square relative">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl shadow-sm mix-blend-multiply"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm">
                <Badge variant="destructive" className="text-lg px-4 py-2">Out of Stock</Badge>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary">{product.category}</Badge>
              <span className="text-sm text-muted-foreground font-medium">Brand: {product.brand}</span>
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">{product.name}</h1>
            <div className="text-3xl font-bold text-primary mb-6">
              ${product.price.toFixed(2)}
            </div>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-center space-x-3 text-sm">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                <span>1-year brand warranty included</span>
              </div>
            </div>

            <Separator className="mb-8" />

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <span className="font-medium">Quantity</span>
                <span className={`text-sm ${isOutOfStock ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {isOutOfStock ? '0 in stock' : `${product.stock} available`}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <QuantitySelector 
                  quantity={quantity} 
                  onChange={setQuantity} 
                  max={product.stock} 
                  disabled={isOutOfStock}
                />
                <Button 
                  size="lg" 
                  className="flex-grow h-12 text-lg"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}