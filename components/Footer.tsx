
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Section: Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16 items-center">
          <div className="lg:col-span-1">
            <span className="text-2xl font-black text-white tracking-tighter mb-2 block">
              ONOS<span className="text-orange-500">.</span>
            </span>
            <p className="text-sm text-gray-400">Be the first to know about our latest deals and new arrivals!</p>
          </div>
          <div className="lg:col-span-2">
            <form className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 bg-gray-800 border-none rounded-lg px-6 py-4 text-sm focus:ring-2 focus:ring-orange-500 transition-all"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all active:scale-95">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 border-t border-gray-800 pt-16">
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Need Help?</h4>
            <ul className="space-y-4 text-xs">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">How to shop on ONOS</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Delivery options and timelines</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">How to return a product</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Report a Product</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">About ONOS</h4>
            <ul className="space-y-4 text-xs">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">ONOS Express</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Terms and Conditions</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Privacy Notice</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">ONOS Global</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Make Money</h4>
            <ul className="space-y-4 text-xs">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Sell on ONOS</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Become a Logistics Partner</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Sales Consultant Program</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Service Partner Program</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">ONOS International</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a href="#" className="hover:text-orange-500">Nigeria</a>
              <a href="#" className="hover:text-orange-500">Kenya</a>
              <a href="#" className="hover:text-orange-500">Egypt</a>
              <a href="#" className="hover:text-orange-500">Ghana</a>
              <a href="#" className="hover:text-orange-500">Morocco</a>
              <a href="#" className="hover:text-orange-500">Ivory Coast</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-800">
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-all">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-all">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-all">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition-all">
              <i className="fa-brands fa-youtube"></i>
            </a>
          </div>
          <div className="text-[10px] text-gray-500 font-medium">
            © 2024 ONOS Marketplace. All rights reserved. Built with precision for the modern shopper.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
