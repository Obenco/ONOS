
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import GeminiAssistant from './components/GeminiAssistant';
import ProductDetailModal from './components/ProductDetailModal';
import FilterSidebar from './components/FilterSidebar';
import { PRODUCTS, CATEGORIES } from './constants';
import { Product, CartItem, Review } from './types';
import { getAIRecommendations } from './services/geminiService';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [aiRecs, setAiRecs] = useState<{ productId: string; reason: string }[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Filter States
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('onos_wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Failed to parse wishlist", e);
      }
    }
    
    const savedProducts = localStorage.getItem('onos_products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Failed to parse products", e);
      }
    }
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('onos_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('onos_products', JSON.stringify(products));
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    // Apply additional filters
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }
    return result;
  }, [searchQuery, activeCategory, products, selectedBrands, priceRange, minRating]);

  useEffect(() => {
    const fetchRecs = async () => {
      if (searchQuery.length > 2) {
        setIsAiLoading(true);
        const data = await getAIRecommendations(searchQuery, products);
        setAiRecs(data.recommendations || []);
        setIsAiLoading(false);
      } else {
        setAiRecs([]);
      }
    };
    const timer = setTimeout(fetchRecs, 1000);
    return () => clearTimeout(timer);
  }, [searchQuery, products]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const submitReview = (productId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `r-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };

    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updatedReviews = [...(p.reviews || []), newReview];
        const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return { 
          ...p, 
          reviews: updatedReviews, 
          reviewCount: updatedReviews.length,
          rating: Number(avgRating.toFixed(1))
        };
      }
      return p;
    }));
    
    if (selectedProduct?.id === productId) {
      setSelectedProduct(prev => {
        if (!prev) return null;
        const updatedReviews = [...(prev.reviews || []), newReview];
        const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return { 
          ...prev, 
          reviews: updatedReviews, 
          reviewCount: updatedReviews.length,
          rating: Number(avgRating.toFixed(1))
        };
      });
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, nextQty) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(p => p.id !== id));
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 2000]);
    setMinRating(0);
    setSearchQuery('');
    setActiveCategory('all');
  };

  const recommendedProducts = useMemo(() => {
    return aiRecs.map(rec => products.find(p => p.id === rec.productId)).filter(Boolean) as Product[];
  }, [aiRecs, products]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-20">
      <Navbar 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        wishlistCount={wishlist.length}
        onSearch={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onGoHome={clearAllFilters}
      />

      <main className="max-w-7xl mx-auto px-4 pt-6">
        {/* Mobile Category Pills & Filter Button */}
        <div className="flex items-center gap-2 mb-6 pb-2 hide-scrollbar">
           <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex lg:hidden px-4 py-2 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 shadow-sm whitespace-nowrap items-center gap-2 hover:bg-orange-50 transition-colors"
          >
            <i className="fa-solid fa-filter"></i>
            FILTER
          </button>
          
          <div className="flex overflow-x-auto gap-2 hide-scrollbar lg:hidden flex-1">
            <button 
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === 'all' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 shadow-sm'
              }`}
            >
              All Categories
            </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                  activeCategory === cat.slug ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 shadow-sm'
                }`}
              >
                <i className={`fa-solid ${cat.icon}`}></i>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Section */}
        {!searchQuery && activeCategory === 'all' && <Hero />}

        {/* AI Recommendations Section */}
        {searchQuery && recommendedProducts.length > 0 && (
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 uppercase">Gemini Recommendations</h2>
                <p className="text-xs text-gray-500 font-medium">Smart picks tailored to your search</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendedProducts.map(product => (
                <div key={product.id} className="relative">
                  <ProductCard 
                    product={product} 
                    onAddToCart={addToCart} 
                    onToggleWishlist={toggleWishlist}
                    onViewDetails={setSelectedProduct}
                    isWishlisted={wishlist.some(p => p.id === product.id)}
                  />
                  <div className="absolute top-2 left-2 pointer-events-none">
                    <span className="bg-orange-500 text-white text-[8px] px-1.5 py-0.5 rounded shadow-sm font-bold animate-pulse">
                      TOP PICK
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-8 items-start">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 custom-scrollbar">
            <FilterSidebar 
              products={products}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              minRating={minRating}
              setMinRating={setMinRating}
              onClearAll={clearAllFilters}
            />
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                  {searchQuery ? `Search results for "${searchQuery}"` : activeCategory === 'all' ? 'Top Selling Items' : `${CATEGORIES.find(c => c.slug === activeCategory)?.name}`}
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {filteredProducts.length} items found
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">SORT BY:</span>
                <select className="text-xs font-bold bg-white border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer">
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={addToCart} 
                    onToggleWishlist={toggleWishlist}
                    onViewDetails={setSelectedProduct}
                    isWishlisted={wishlist.some(p => p.id === product.id)}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <i className="fa-solid fa-magnifying-glass text-3xl text-gray-300"></i>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">No products found</h3>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or search query.</p>
                  <button 
                    onClick={clearAllFilters}
                    className="mt-6 bg-orange-500 text-white px-6 py-2 rounded font-bold text-sm shadow-md transition-all active:scale-95"
                  >
                    RESET ALL FILTERS
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer */}
      <div 
        className={`fixed inset-0 z-[70] transition-opacity duration-300 ${isMobileFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/60" onClick={() => setIsMobileFilterOpen(false)} />
        <div className={`absolute left-0 top-0 h-full w-full max-w-xs bg-[#f5f5f5] shadow-2xl transition-transform duration-300 transform ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900 uppercase">Filters</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-2">
                <i className="fa-solid fa-xmark text-xl text-gray-500"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FilterSidebar 
                products={products}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minRating={minRating}
                setMinRating={setMinRating}
                onClearAll={clearAllFilters}
              />
            </div>
            <div className="p-4 bg-white border-t">
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold uppercase tracking-wider shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlist}
        onRemove={removeFromWishlist}
        onAddToCart={addToCart}
      />

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          onSubmitReview={submitReview}
        />
      )}

      <GeminiAssistant availableProducts={products} />

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center lg:hidden z-40">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-bold uppercase">Daily Deals</span>
          <span className="text-sm font-black text-orange-500">Flash Sale Ending Soon</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsWishlistOpen(true)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <i className="fa-regular fa-heart text-xl"></i>
          </button>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg active:scale-95 transition-all"
          >
            CART ({cart.reduce((a, b) => a + b.quantity, 0)})
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
