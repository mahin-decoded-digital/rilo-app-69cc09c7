import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FilterSidebar from '@/components/FilterSidebar';
import SortDropdown from '@/components/SortDropdown';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { FilterOptions, SortOption, useProductStore } from '@/store/productStore';
import { ShoppingBag } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export default function CategoryPage() {
  const { categoryName } = useParams<{ categoryName: string }>();
  
  const [filters, setFilters] = useState<FilterOptions>({ categories: categoryName ? [categoryName] : [] });
  const [sort, setSort] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const products = useProductStore((s) => s.products);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const fetchCategories = useProductStore((s) => s.fetchCategories);
  const getFilteredAndSortedProducts = useProductStore((s) => s.getFilteredAndSortedProducts);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Sync filters if URL param changes
  useEffect(() => {
    if (categoryName) {
      setFilters((prev) => ({ ...prev, categories: [categoryName] }));
      setCurrentPage(1);
    }
  }, [categoryName]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sort]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return getFilteredAndSortedProducts(filters, sort);
  }, [products, filters, sort, getFilteredAndSortedProducts]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar filters={filters} onFilterChange={setFilters} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-3xl font-bold tracking-tight">
                {categoryName || 'Category'} <span className="text-muted-foreground text-lg font-normal">({filteredProducts.length})</span>
              </h1>
              <SortDropdown value={sort} onChange={setSort} />
            </div>

            {paginatedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-lg border border-dashed">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products found in this category</h3>
                <p className="text-muted-foreground max-w-sm">
                  Try adjusting your filters or checking back later for new arrivals.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}