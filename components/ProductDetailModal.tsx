
import React, { useState } from 'react';
import { Product, Review } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  onSubmitReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart, onSubmitReview }) => {
  const [newReview, setNewReview] = useState({ reviewerName: '', rating: 5, comment: '' });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.reviewerName || !newReview.comment) return;
    onSubmitReview(product.id, newReview);
    setNewReview({ reviewerName: '', rating: 5, comment: '' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-y-auto animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-colors"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Image Gallery Mock */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all">
                    <img src={product.image} className="w-full h-full object-cover opacity-50 rounded-lg" alt="" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                {product.isOfficial && (
                  <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded mb-2 italic">
                    <i className="fa-solid fa-certificate"></i> OFFICIAL STORE
                  </span>
                )}
                <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">{product.name}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-sm text-orange-400">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fa-solid fa-star ${i < Math.floor(product.rating) ? '' : 'text-gray-200'}`}></i>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-blue-600 cursor-pointer hover:underline">({product.reviewCount} verified reviews)</span>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-black text-gray-900">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                <p className="text-xs text-green-600 font-bold">In Stock</p>
                <p className="text-[10px] text-gray-400 mt-1">+ shipping from $5.00 to your location</p>
              </div>

              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              <button 
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-orange-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <i className="fa-solid fa-cart-plus"></i>
                ADD TO CART
              </button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t pt-10">
            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
              Verified Customer Reviews
              <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full">{product.reviews?.length || 0}</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-6">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map(review => (
                    <div key={review.id} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 font-bold text-xs">
                            {review.reviewerName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900">{review.reviewerName}</p>
                            <p className="text-[10px] text-gray-400">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex text-[10px] text-orange-400">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fa-solid fa-star ${i < review.rating ? '' : 'text-gray-200'}`}></i>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed italic">"{review.comment}"</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <i className="fa-regular fa-comments text-4xl text-gray-200 mb-3 block"></i>
                    <p className="text-gray-400 text-sm">No reviews yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>

              {/* Add Review Form */}
              <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 h-fit sticky top-4">
                <h4 className="text-sm font-black text-gray-900 uppercase mb-4">Write a Review</h4>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Your Name</label>
                    <input 
                      type="text"
                      required
                      className="w-full text-sm bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
                      placeholder="e.g. John Doe"
                      value={newReview.reviewerName}
                      onChange={e => setNewReview(prev => ({ ...prev, reviewerName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(star => (
                        <button 
                          key={star}
                          type="button"
                          onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                          className={`text-xl transition-all ${star <= newReview.rating ? 'text-orange-400' : 'text-gray-200'}`}
                        >
                          <i className="fa-solid fa-star"></i>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Review Text</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full text-sm bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all"
                      placeholder="What did you like or dislike about this product?"
                      value={newReview.comment}
                      onChange={e => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
