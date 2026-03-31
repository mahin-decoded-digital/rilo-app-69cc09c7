import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminNav from '@/components/AdminNav';
import ProductForm from '@/components/ProductForm';

export default function AdminAddProductPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/10">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <AdminNav />
        </aside>
        <div className="flex-grow max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
            <p className="text-muted-foreground">Create a new product for your store.</p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <ProductForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}