
import React, { useState, useEffect } from 'react';

const BANNERS = [
  { 
    id: 1, 
    image: 'https://picsum.photos/seed/shop1/1200/400', 
    title: 'Up to 50% Off Phones', 
    subtitle: 'Latest Samsung & iPhone models',
    color: 'bg-orange-600'
  },
  { 
    id: 2, 
    image: 'https://picsum.photos/seed/shop2/1200/400', 
    title: 'Tech Fest 2024', 
    subtitle: 'Computing essentials for work & play',
    color: 'bg-blue-600'
  },
  { 
    id: 3, 
    image: 'https://picsum.photos/seed/shop3/1200/400', 
    title: 'Home Makeover Sale', 
    subtitle: 'Upgrade your living space today',
    color: 'bg-green-600'
  }
];

const Hero: React.FC = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
      {/* Sidebar Categories (Mock) */}
      <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-100 p-2 overflow-hidden">
        <div className="flex flex-col gap-1">
          {[
            { icon: 'fa-mobile-screen', label: 'Phones & Tablets' },
            { icon: 'fa-tv', label: 'Electronics' },
            { icon: 'fa-shirt', label: 'Fashion' },
            { icon: 'fa-couch', label: 'Home & Office' },
            { icon: 'fa-laptop', label: 'Computing' },
            { icon: 'fa-baby', label: 'Baby Products' },
            { icon: 'fa-shield-heart', label: 'Health & Beauty' },
            { icon: 'fa-cart-shopping', label: 'Supermarket' },
            { icon: 'fa-gamepad', label: 'Gaming' },
            { icon: 'fa-basketball', label: 'Sporting Goods' },
            { icon: 'fa-ellipsis', label: 'Other Categories' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-md cursor-pointer transition-all">
              <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
              <span className="truncate">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Slider */}
      <div className="lg:col-span-2 relative h-[250px] md:h-[400px] bg-gray-200 rounded-lg overflow-hidden shadow-sm">
        {BANNERS.map((banner, idx) => (
          <div 
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === active ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={banner.image} 
              alt={banner.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-8 md:p-12">
              <h2 className="text-white text-3xl md:text-5xl font-black mb-2 drop-shadow-lg uppercase leading-tight">
                {banner.title}
              </h2>
              <p className="text-white text-lg md:text-xl font-medium mb-6 opacity-90">
                {banner.subtitle}
              </p>
              <button className="w-fit bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md font-bold text-sm transition-all transform hover:scale-105 shadow-xl">
                SHOP NOW
              </button>
            </div>
          </div>
        ))}
        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {BANNERS.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setActive(idx)}
              className={`h-2 rounded-full transition-all ${idx === active ? 'w-8 bg-orange-500' : 'w-2 bg-white/50 hover:bg-white'}`}
            />
          ))}
        </div>
      </div>

      {/* Promo Squares */}
      <div className="hidden lg:flex flex-col gap-4">
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden relative group cursor-pointer border border-gray-100">
          <img src="https://picsum.photos/seed/promo1/400/200" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Promo 1" />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-1 rounded font-bold text-xs uppercase tracking-wider">Free Delivery</span>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden relative group cursor-pointer border border-gray-100">
          <img src="https://picsum.photos/seed/promo2/400/200" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Promo 2" />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-4 py-1 rounded font-bold text-xs uppercase tracking-wider">Official Stores</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
