import React from 'react';
import { Smartphone, Laptop, Camera, Headphones, Watch, ShoppingBag, Sparkles, Heart, Shirt } from 'lucide-react';

const categories = [
  { name: 'スマホ 📱', icon: Smartphone, count: 1250, color: 'from-blue-400 to-blue-600' },
  { name: 'パソコン 💻', icon: Laptop, count: 890, color: 'from-indigo-400 to-indigo-600' },
  { name: 'カメラ 📸', icon: Camera, count: 567, color: 'from-green-400 to-green-600' },
  { name: 'コスメ 💄', icon: Heart, count: 1089, color: 'from-pink-400 to-rose-600' },
  { name: 'ファッション 👗', icon: Shirt, count: 743, color: 'from-purple-400 to-violet-600' },
  { name: 'オーディオ 🎧', icon: Headphones, count: 432, color: 'from-cyan-400 to-cyan-600' },
  { name: 'ウェアラブル ⌚', icon: Watch, count: 321, color: 'from-sky-400 to-sky-600' },
  { name: 'ライフスタイル 🏠', icon: ShoppingBag, count: 892, color: 'from-emerald-400 to-teal-600' },
  { name: 'その他 ✨', icon: Sparkles, count: 2100, color: 'from-blue-400 to-indigo-600' },
];

export const CategoryNav: React.FC = () => {
  return (
    <nav className="bg-white border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-4 py-2 sm:py-3 md:py-4 overflow-x-auto scrollbar-hide">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.name}
                className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 rounded-full bg-gradient-to-r hover:shadow-lg transform hover:scale-105 transition-all duration-200 whitespace-nowrap font-medium bg-white/95 border border-blue-200 hover:bg-white hover:border-blue-300 flex-shrink-0"
              >
                <div className={`p-0.5 sm:p-1 rounded-full bg-gradient-to-br ${category.color}`}>
                  <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <span className="text-xs sm:text-sm md:text-base font-bold text-blue-900 drop-shadow-sm">{category.name}</span>
                <span className="text-[10px] sm:text-xs md:text-sm bg-white/90 px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-1 rounded-full text-blue-800 font-bold">
                  {category.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
