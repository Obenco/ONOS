
import React from 'react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemove: (id: string) => void;
  onAddToCart: (p: Product) => void;
}

const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose, items, onRemove, onAddToCart }) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-[60] shadow-2xl transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <i className="fa-regular fa-heart text-red-500"></i>
              Wishlist ({items.length})
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <i className="fa-solid fa-xmark text-xl text-gray-500"></i>
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4">
                  <i className="fa-regular fa-heart text-4xl text-red-200"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Your wishlist is empty!</h3>
                <p className="text-sm text-gray-500 mb-6">Save items you're interested in and come back later.</p>
                <button 
                  onClick={onClose}
                  className="bg-orange-500 text-white px-8 py-3 rounded-md font-bold text-sm shadow-md"
                >
                  BROWSE PRODUCTS
                </button>
              </div>
            ) : (
              items.map(item => (
                <div key={item.id} className="flex gap-4 p-3 border rounded-lg hover:border-red-100 transition-colors">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded bg-gray-50" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800 line-clamp-1 mb-1">{item.name}</h4>
                    <p className="text-sm font-bold text-gray-900 mb-2">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          onAddToCart(item);
                          onRemove(item.id);
                        }}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-1.5 rounded text-[10px] font-bold shadow-sm transition-all"
                      >
                        ADD TO CART
                      </button>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="px-3 py-1.5 border border-gray-200 text-gray-500 rounded text-[10px] font-bold hover:bg-gray-50 transition-all"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WishlistDrawer;
