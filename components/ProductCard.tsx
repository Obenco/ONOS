
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  onViewDetails: (p: Product) => void;
  isWishlisted: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onToggleWishlist, onViewDetails, isWishlisted }) => {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div 
      onClick={() => onViewDetails(product)}
      className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100 overflow-hidden relative cursor-pointer"
    >
      {/* Wishlist Toggle */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product);
        }}
        className={`absolute top-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isWishlisted 
            ? 'bg-red-50 text-red-500 shadow-sm' 
            : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white'
        }`}
      >
        <i className={`${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
      </button>

      {/* Badge/Discount */}
      {discount > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-orange-100 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
          -{discount}%
        </span>
      )}
      
      {product.badge && !discount && (
        <span className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
          {product.badge}
        </span>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-sm text-gray-800 font-normal line-clamp-2 mb-2 leading-tight min-h-[2.5rem] group-hover:text-orange-500 transition-colors">
          {product.name}
        </h3>
        
        <div className="mt-auto">
          <div className="flex flex-col mb-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-[10px] text-orange-400">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`fa-solid fa-star ${i < Math.floor(product.rating) ? '' : 'text-gray-200'}`}></i>
              ))}
            </div>
            <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
          </div>

          {product.isOfficial && (
            <div className="flex items-center gap-1 mb-3">
              <span className="bg-blue-600 text-white text-[8px] font-black px-1 py-0.5 rounded-sm flex items-center gap-1 italic">
                <i className="fa-solid fa-certificate"></i> OFFICIAL STORE
              </span>
            </div>
          )}

          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-cart-plus"></i>
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
