import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  
  const cartItems = useCartStore((s) => s.cartItems);
  
  const cartItemCount = useMemo(() => {
    return (cartItems ?? []).reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-lg border-b shadow-sm' : 'bg-background border-b border-transparent'}`}>
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tighter text-foreground group">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <ShoppingBag className="h-6 w-6" />
          </div>
          Luxe<span className="text-primary">Store</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8 flex-1 ml-12">
          <Link to="/" className={`text-sm font-semibold transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}>Home</Link>
          <Link to="/products" className={`text-sm font-semibold transition-colors hover:text-primary ${location.pathname === '/products' ? 'text-primary' : 'text-muted-foreground'}`}>Products</Link>
          {isAdmin && (
            <Link to="/admin" className={`text-sm font-semibold transition-colors hover:text-primary ${location.pathname.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground'}`}>Admin Dashboard</Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link to="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors rounded-full hover:bg-muted">
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center p-0 rounded-full text-[10px] bg-primary text-primary-foreground translate-x-1/4 -translate-y-1/4 border-2 border-background">
                {cartItemCount}
              </Badge>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/profile" className="flex items-center space-x-2 text-sm font-medium text-foreground hover:bg-muted px-3 py-2 rounded-full transition-colors">
                <div className="h-7 w-7 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="max-w-[100px] truncate">{user?.name}</span>
              </Link>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={handleLogout} title="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" className="rounded-full font-semibold" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button className="rounded-full font-semibold" asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden rounded-full" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b shadow-lg px-4 py-6 space-y-6">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="text-lg font-semibold hover:text-primary transition-colors">Home</Link>
            <Link to="/products" className="text-lg font-semibold hover:text-primary transition-colors">Products</Link>
            {isAdmin && (
              <Link to="/admin" className="text-lg font-semibold text-primary">Admin Dashboard</Link>
            )}
          </div>
          <div className="border-t pt-6 flex flex-col space-y-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="flex items-center space-x-3 text-lg font-semibold">
                  <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <span>{user?.name}</span>
                </Link>
                <Button variant="outline" className="w-full h-12 rounded-full text-base font-semibold" onClick={handleLogout}>
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Button variant="outline" className="w-full h-12 rounded-full text-base font-semibold" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button className="w-full h-12 rounded-full text-base font-semibold" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}