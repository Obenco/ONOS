
import React, { useState } from 'react';
import { CartItem } from '../types';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onSearch: (q: string) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onGoHome: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, wishlistCount, onSearch, onOpenCart, onOpenWishlist, onGoHome }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer group"
          onClick={onGoHome}
        >
          <span className="text-2xl font-black text-orange-500 tracking-tighter group-hover:scale-105 transition-transform">
            ONOS
          </span>
        </div>

        {/* Search Bar */}
        <form 
          onSubmit={handleSubmit}
          className="flex-1 max-w-2xl flex relative"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-sm"
            placeholder="Search products, brands and categories"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="ml-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm hidden md:block"
          >
            SEARCH
          </button>
        </form>

        {/* Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden lg:flex items-center gap-2 cursor-pointer hover:text-orange-500 transition-colors">
            <i className="fa-regular fa-user text-xl"></i>
            <span className="text-sm font-medium">Account</span>
            <i className="fa-solid fa-chevron-down text-xs"></i>
          </div>

          <button 
            onClick={onOpenWishlist}
            className="flex items-center gap-2 cursor-pointer relative group p-2 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <div className="relative">
              <i className="fa-regular fa-heart text-xl text-gray-700 group-hover:text-orange-500 transition-colors"></i>
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="hidden md:inline text-sm font-bold text-gray-700 group-hover:text-orange-500 transition-colors">Wishlist</span>
          </button>
          
          <button 
            onClick={onOpenCart}
            className="flex items-center gap-2 cursor-pointer relative group p-2 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <div className="relative">
              <i className="fa-solid fa-cart-shopping text-xl text-gray-700 group-hover:text-orange-500 transition-colors"></i>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden md:inline text-sm font-bold text-gray-700 group-hover:text-orange-500 transition-colors">Cart</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
