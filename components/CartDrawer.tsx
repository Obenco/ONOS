
import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove }) => {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

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
              <i className="fa-solid fa-cart-shopping text-orange-500"></i>
              Cart ({items.length})
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <i className="fa-solid fa-xmark text-xl text-gray-500"></i>
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                  <i className="fa-solid fa-cart-shopping text-4xl text-orange-200"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Your cart is empty!</h3>
                <p className="text-sm text-gray-500 mb-6">Browse our categories and discover our best deals!</p>
                <button 
                  onClick={onClose}
                  className="bg-orange-500 text-white px-8 py-3 rounded-md font-bold text-sm shadow-md"
                >
                  START SHOPPING
                </button>
              </div>
            ) : (
              items.map(item => (
                <div key={item.id} className="flex gap-4 p-3 border rounded-lg hover:border-orange-200 transition-colors">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded bg-gray-50" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800 line-clamp-1 mb-1">{item.name}</h4>
                    <p className="text-sm font-bold text-orange-500 mb-2">${item.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <i className="fa-solid fa-minus text-[10px]"></i>
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-gray-700 bg-white min-w-[30px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600"
                        >
                          <i className="fa-solid fa-plus text-[10px]"></i>
                        </button>
                      </div>
                      <button 
                        onClick={() => onRemove(item.id)}
                        className="text-red-500 text-xs font-semibold hover:underline flex items-center gap-1"
                      >
                        <i className="fa-regular fa-trash-can"></i> REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="text-xl font-black text-gray-900">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <p className="text-[10px] text-gray-400 mb-4">* Delivery fees not included</p>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-md font-bold text-lg shadow-lg transform transition active:scale-95">
                CHECKOUT (${total.toLocaleString(undefined, { minimumFractionDigits: 2 })})
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
