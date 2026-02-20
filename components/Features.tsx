
import React from 'react';

const FEATURES = [
  { icon: 'fa-truck-fast', title: 'Fast Delivery', desc: 'Across all major cities' },
  { icon: 'fa-shield-halved', title: 'Secure Payment', desc: '100% protected transactions' },
  { icon: 'fa-rotate-left', title: 'Easy Returns', desc: '7-day return policy' },
  { icon: 'fa-headset', title: '24/7 Support', desc: 'Dedicated service team' }
];

const Features: React.FC = () => {
  return (
    <div className="bg-white py-10 border-y border-gray-100 mb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex flex-col items-center text-center group cursor-default">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                <i className={`fa-solid ${f.icon} text-2xl`}></i>
              </div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
