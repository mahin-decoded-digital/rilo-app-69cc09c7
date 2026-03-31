import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useProductStore } from '@/store/productStore';
import {ArrowRight, Truck, ShieldCheck, CreditCard, Database} from 'lucide-react';

export default function HomePage() {
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const fetchCategories = useProductStore((s) => s.fetchCategories);
  const products = useProductStore((s) => s.products);
  const categories = useProductStore((s) => s.categories);
  const isLoading = useProductStore((s) => s.isLoading);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const featuredProducts = useMemo(() => {
    return (products ?? []).slice(0, 8);
  }, [products]);

  const features = [
    { icon: <Truck className="h-8 w-8 mb-4 text-primary" />, title: 'Free Shipping', desc: 'On all orders over $100' },
    { icon: <ShieldCheck className="h-8 w-8 mb-4 text-primary" />, title: 'Secure Payment', desc: '100% secure payment' },
    { icon: <CreditCard className="h-8 w-8 mb-4 text-primary" />, title: 'Money Back', desc: '30 days return policy' },
    { icon: <Database className="h-8 w-8 mb-4 text-primary" />, title: '24/7 Support', desc: 'Dedicated support team' },
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-muted overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1920&auto=format&fit=crop" 
              alt="Hero" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent"></div>
          </div>
          <div className="container relative mx-auto px-4 py-24 lg:py-32 flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 flex flex-col items-start text-left space-y-8">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                New Collection 2024
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-tight">
                Elevate Your <br />
                <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Everyday Style</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Discover the latest trends in fashion and accessories. Premium quality, unbeatable prices, and curated just for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link to="/products" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                    Shop Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/products" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full h-14 px-8 text-lg rounded-full hover:bg-primary/5 transition-all">
                    View Offers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-background border-b border-border/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-muted/50 transition-colors">
                  {feature.icon}
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Category Grid Section */}
        <section className="py-20 container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 space-y-4 md:space-y-0">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Shop by Category</h2>
              <p className="text-muted-foreground text-lg">Browse our wide selection of categories to find exactly what you're looking for.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(categories ?? []).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 bg-muted/30 border-t border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 space-y-4 md:space-y-0">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Trending Now</h2>
                <p className="text-muted-foreground text-lg">Handpicked products that our customers are loving right now.</p>
              </div>
              <Link to="/products">
                <Button variant="outline" className="hidden sm:flex rounded-full px-6">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-[300px] bg-muted rounded-2xl animate-pulse"></div>
                    <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-1/3 bg-muted rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            <div className="mt-10 text-center sm:hidden">
              <Link to="/products">
                <Button variant="outline" className="w-full rounded-full h-12">
                  View All Products
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Newsletter Section */}
        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          <div className="container relative mx-auto px-4 flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Newsletter</h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl text-lg">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="flex w-full max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-grow px-4 py-3 rounded-full text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button type="submit" variant="secondary" className="rounded-full px-6 py-3 h-auto font-semibold">
                Subscribe
              </Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}