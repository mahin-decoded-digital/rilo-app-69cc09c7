import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link to={`/products/category/${encodeURIComponent(category.name)}`} className="block group">
      <div className="relative overflow-hidden rounded-2xl h-[320px] shadow-sm hover:shadow-xl transition-all duration-500">
        <img
          src={category.imageUrl}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 transition-opacity duration-300">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-white text-2xl font-bold tracking-wide mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                {category.name}
              </h3>
              <p className="text-white/70 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                Explore Collection
              </p>
            </div>
            <div className="bg-white text-black p-2 rounded-full opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}