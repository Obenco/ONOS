
import React from 'react';
import { Product } from '../types';

interface FilterSidebarProps {
  products: Product[];
  selectedBrands: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  minRating: number;
  setMinRating: React.Dispatch<React.SetStateAction<number>>;
  onClearAll: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  products,
  selectedBrands,
  setSelectedBrands,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  onClearAll,
}) => {
  const brands = Array.from(new Set(products.map((p) => p.brand)));

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Filters</h3>
        <button
          onClick={onClearAll}
          className="text-[10px] font-bold text-orange-500 hover:text-orange-600 uppercase"
        >
          Clear All
        </button>
      </div>

      {/* Brand Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h4 className="text-xs font-black text-gray-900 uppercase mb-4 border-b pb-2">Brand</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
              />
              <span className="text-xs text-gray-600 group-hover:text-orange-500 transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h4 className="text-xs font-black text-gray-900 uppercase mb-4 border-b pb-2">Price ($)</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded px-2 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded px-2 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
          <div className="relative pt-1">
             <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h4 className="text-xs font-black text-gray-900 uppercase mb-4 border-b pb-2">Customer Rating</h4>
        <div className="space-y-3">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={minRating === rating}
                onChange={() => setMinRating(rating)}
                className="w-4 h-4 border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
              />
              <div className="flex items-center gap-1">
                <div className="flex text-[10px] text-orange-400">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fa-solid fa-star ${i < rating ? '' : 'text-gray-200'}`}></i>
                  ))}
                </div>
                <span className="text-[10px] text-gray-600">& Above</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
