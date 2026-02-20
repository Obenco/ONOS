
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import GeminiAssistant from './components/GeminiAssistant';
import ProductDetailModal from './components/ProductDetailModal';
import FilterSidebar from './components/FilterSidebar';
import Features from './components/Features';
import Footer from './components/Footer';
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
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'about' | 'contact'>('home');

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

  const handleDownloadCatalog = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "onos_catalog.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleUploadCatalog = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const newProducts = JSON.parse(content);
        if (Array.isArray(newProducts)) {
          setProducts(newProducts);
          alert('Catalog updated successfully!');
        } else {
          alert('Invalid catalog format. Please upload a JSON array of products.');
        }
      } catch (error) {
        console.error('Failed to parse catalog', error);
        alert('Failed to parse catalog file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        wishlistCount={wishlist.length}
        onSearch={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onGoHome={clearAllFilters}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />

      <main className="max-w-7xl mx-auto px-4 pt-6 pb-20">
        {currentPage === 'home' && (
          <div className="animate-in fade-in duration-500">
            <Hero />
            <Features />
            
            <div className="mb-16">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-8 text-center">Featured Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.slug); setCurrentPage('shop'); }}
                    className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md hover:scale-105 transition-all group border border-gray-50"
                  >
                    <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <i className={`fa-solid ${cat.icon} text-xl`}></i>
                    </div>
                    <span className="text-[10px] font-black text-gray-700 uppercase text-center leading-tight">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">New Arrivals</h2>
                <button onClick={() => setCurrentPage('shop')} className="text-orange-500 font-black text-xs uppercase tracking-widest hover:underline">View All</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.slice(0, 4).map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={addToCart} 
                    onToggleWishlist={toggleWishlist}
                    onViewDetails={setSelectedProduct}
                    isWishlisted={wishlist.some(p => p.id === product.id)}
                  />
                ))}
              </div>
            </div>

            {/* Sell on ONOS Section */}
            <section className="mb-20">
              <div className="bg-gray-900 rounded-3xl overflow-hidden relative min-h-[400px] flex items-center">
                <div className="absolute inset-0 z-0">
                  <img src="https://picsum.photos/seed/vendor/1200/600" className="w-full h-full object-cover opacity-30" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
                </div>
                <div className="relative z-10 p-8 md:p-16 max-w-2xl">
                  <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block">Become a Partner</span>
                  <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                    Expand your business with <span className="text-orange-500">ONOS Vendor</span>
                  </h2>
                  <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                    Join thousands of successful sellers reaching millions of customers across the continent. We provide the tools, the audience, and the logistics.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all active:scale-95">
                      Start Selling Today
                    </button>
                    <button className="border-2 border-white/20 hover:border-white text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentPage === 'shop' && (
          <div className="animate-in fade-in duration-500">
            {/* Mobile Filter Button */}
            <div className="flex items-center gap-2 mb-6 lg:hidden overflow-x-auto hide-scrollbar">
               <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 shadow-sm whitespace-nowrap items-center gap-2"
              >
                <i className="fa-solid fa-filter"></i>
                FILTER
              </button>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                    activeCategory === cat.slug ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 shadow-sm'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* AI Recommendations */}
            {searchQuery && recommendedProducts.length > 0 && (
              <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                <h2 className="text-xl font-black text-gray-900 uppercase mb-6 flex items-center gap-2">
                  <i className="fa-solid fa-wand-magic-sparkles text-orange-500"></i>
                  Smart Recommendations
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recommendedProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={addToCart} 
                      onToggleWishlist={toggleWishlist}
                      onViewDetails={setSelectedProduct}
                      isWishlisted={wishlist.some(p => p.id === product.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-8 items-start">
              {/* Desktop Filters */}
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
                  onDownloadCatalog={handleDownloadCatalog}
                  onUploadCatalog={handleUploadCatalog}
                />
              </aside>

              {/* Product Feed */}
              <div className="flex-1">
                <div className="mb-6 flex justify-between items-end">
                  <div>
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                      {searchQuery ? `Search for "${searchQuery}"` : activeCategory === 'all' ? 'All Products' : `${activeCategory}`}
                    </h2>
                    <p className="text-xs text-gray-500 font-medium">{filteredProducts.length} items</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAddToCart={addToCart} 
                      onToggleWishlist={toggleWishlist}
                      onViewDetails={setSelectedProduct}
                      isWishlisted={wishlist.some(p => p.id === product.id)}
                    />
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="py-20 text-center">
                    <i className="fa-solid fa-magnifying-glass text-5xl text-gray-200 mb-4 block"></i>
                    <h3 className="text-lg font-bold text-gray-800">No results found</h3>
                    <button onClick={clearAllFilters} className="mt-4 text-orange-500 font-bold uppercase text-xs">Clear Filters</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'about' && (
          <div className="animate-in fade-in duration-500 max-w-4xl mx-auto py-12">
            <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter mb-8">About <span className="text-orange-500">ONOS</span></h1>
            <div className="space-y-8 text-gray-600 leading-relaxed">
              <p className="text-xl font-medium">
                ONOS is Africa's leading e-commerce platform, dedicated to bringing the best products from around the world directly to your doorstep.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
                  <h3 className="text-lg font-black text-gray-900 uppercase mb-4">Our Mission</h3>
                  <p className="text-sm">To provide a seamless, secure, and enjoyable shopping experience for millions of customers while empowering local businesses to reach a global audience.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50">
                  <h3 className="text-lg font-black text-gray-900 uppercase mb-4">Our Vision</h3>
                  <p className="text-sm">To become the most customer-centric marketplace on the continent, where anyone can find and discover anything they want to buy online.</p>
                </div>
              </div>
              <img src="https://picsum.photos/seed/about/1200/600" className="w-full h-[400px] object-cover rounded-3xl shadow-xl" alt="About ONOS" />
              <p>
                Founded in 2024, ONOS has quickly grown from a small startup to a major player in the digital economy. We believe in the power of technology to transform lives and create opportunities. Our team is passionate about innovation, customer service, and building a sustainable future for e-commerce.
              </p>
            </div>
          </div>
        )}

        {currentPage === 'contact' && (
          <div className="animate-in fade-in duration-500 max-w-5xl mx-auto py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter mb-8">Get in <span className="text-orange-500">Touch</span></h1>
                <p className="text-gray-600 mb-10 leading-relaxed">
                  Have questions about an order, a product, or want to become a seller? Our team is here to help you 24/7.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-orange-500">
                      <i className="fa-solid fa-location-dot"></i>
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase">Headquarters</p>
                      <p className="text-sm text-gray-500">123 Marketplace Ave, Lagos, Nigeria</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-orange-500">
                      <i className="fa-solid fa-phone"></i>
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase">Phone</p>
                      <p className="text-sm text-gray-500">+234 800 ONOS HELP</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-orange-500">
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-900 uppercase">Email</p>
                      <p className="text-sm text-gray-500">support@onos.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-50">
                <h3 className="text-xl font-black text-gray-900 uppercase mb-6">Send us a Message</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">First Name</label>
                      <input type="text" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Last Name</label>
                      <input type="text" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Email Address</label>
                    <input type="email" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Subject</label>
                    <select className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500">
                      <option>Order Inquiry</option>
                      <option>Product Question</option>
                      <option>Seller Support</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Message</label>
                    <textarea rows={4} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500" placeholder="How can we help you?"></textarea>
                  </div>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all active:scale-95">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQuantity={(id, d) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))}
        onRemove={id => setCart(prev => prev.filter(i => i.id !== id))}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlist}
        onRemove={id => setWishlist(prev => prev.filter(i => i.id !== id))}
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
    </div>
  );
};

export default App;
