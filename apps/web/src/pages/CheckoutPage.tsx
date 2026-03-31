import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { Address } from '@/types';
import { CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const cartItems = useCartStore((s) => s.cartItems);
  const clearCart = useCartStore((s) => s.clearCart);
  const placeOrder = useOrderStore((s) => s.placeOrder);

  const [address, setAddress] = useState<Address>({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [cartItems, navigate]);

  const subtotal = useMemo(() => {
    return (cartItems ?? []).reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItems]);

  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsProcessing(true);

    try {
      await placeOrder(user.id, cartItems, total, address);
      await clearCart();
      navigate('/profile', { state: { orderSuccess: true } });
    } catch (err) {
      console.error('Checkout failed', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">1</span>
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input 
                    id="street" 
                    required 
                    value={address.street} 
                    onChange={(e) => setAddress({...address, street: e.target.value})} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      required 
                      value={address.city} 
                      onChange={(e) => setAddress({...address, city: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input 
                      id="state" 
                      required 
                      value={address.state} 
                      onChange={(e) => setAddress({...address, state: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP / Postal Code</Label>
                    <Input 
                      id="zip" 
                      required 
                      value={address.zip} 
                      onChange={(e) => setAddress({...address, zip: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input 
                      id="country" 
                      required 
                      value={address.country} 
                      onChange={(e) => setAddress({...address, country: e.target.value})} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Simulated Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">2</span>
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-4 mb-4">
                  <ShieldCheck className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    This is a simulated checkout. Do not enter real credit card information. Any 16 digits will work.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cc-name">Name on Card</Label>
                  <Input id="cc-name" required defaultValue={user?.name || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cc-number">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="cc-number" className="pl-10" required placeholder="0000 0000 0000 0000" maxLength={19} pattern="[0-9\s]{16,19}" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cc-exp">Expiry Date</Label>
                    <Input id="cc-exp" required placeholder="MM/YY" maxLength={5} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cc-cvc">CVC</Label>
                    <Input id="cc-cvc" required placeholder="123" maxLength={4} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Review Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {(cartItems ?? []).map((item) => (
                    <div key={item.productId} className="flex items-center gap-4">
                      <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full text-lg h-12" 
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-background border-r-transparent rounded-full animate-spin"></span>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Place Order
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}