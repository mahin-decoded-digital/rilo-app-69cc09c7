import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300 mt-auto">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 text-2xl font-black tracking-tighter text-white">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <ShoppingBag className="h-6 w-6" />
              </div>
              Luxe<span className="text-primary">Store</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-zinc-400">
              Your ultimate destination for premium fashion and accessories. 
              We blend quality craftsmanship with contemporary design to bring you pieces that inspire.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/products/category/Men" className="hover:text-white transition-colors">Men's Fashion</Link></li>
              <li><Link to="/products/category/Women" className="hover:text-white transition-colors">Women's Fashion</Link></li>
              <li><Link to="/products/category/Accessories" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Order History</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between text-sm text-zinc-500">
          <p>&copy; {new Date().getFullYear()} LuxeStore. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0 items-center">
            <span>Secured Payment with:</span>
            <div className="flex space-x-2">
              <div className="w-8 h-5 bg-zinc-800 rounded"></div>
              <div className="w-8 h-5 bg-zinc-800 rounded"></div>
              <div className="w-8 h-5 bg-zinc-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}