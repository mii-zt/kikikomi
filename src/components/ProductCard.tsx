import React from 'react';
import { Star, MessageSquare, Users, CheckCircle, Heart } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: string;
  communityMembers: number;
  hasVerifiedReviews: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  image,
  rating,
  reviewCount,
  price,
  communityMembers,
  hasVerifiedReviews,
}) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-blue-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1">
      <div className="aspect-w-16 aspect-h-12 overflow-hidden rounded-t-xl sm:rounded-t-2xl relative">
        <img
          src={image}
          alt={name}
          className="w-full h-32 sm:h-36 md:h-40 object-cover"
        />
        {/* 価格表示を画像の左上に移動 */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          <div className="bg-blue-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-lg">
            <span className="text-xs sm:text-sm md:text-base font-bold">
              {price}
            </span>
          </div>
        </div>
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
          <button className="p-1.5 sm:p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200">
            <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 hover:text-blue-500" />
          </button>
        </div>
      </div>
      
      <div className="p-3 sm:p-4 md:p-5">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
          {name}
        </h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 sm:h-5 sm:w-5 ${
                  i < Math.floor(rating) 
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-1 sm:ml-2 text-sm sm:text-base font-bold text-gray-800">
              {rating.toFixed(1)}
            </span>
          </div>
          {hasVerifiedReviews && (
            <div className="flex items-center bg-green-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full w-fit">
              <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-600" />
              <span className="text-[10px] sm:text-xs text-green-700 ml-0.5 sm:ml-1 font-bold">購入済み</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 mb-3 sm:mb-4 text-sm sm:text-base text-gray-700">
          <div className="flex items-center bg-blue-50 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full">
            <MessageSquare className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 text-blue-500" />
            <span className="font-bold text-[10px] sm:text-xs">{reviewCount}件</span>
          </div>
          <div className="flex items-center bg-purple-50 px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full">
            <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1 text-purple-500" />
            <span className="font-bold text-[10px] sm:text-xs">{communityMembers}人</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">みんなの平均評価: {rating}/5.0 ⭐</p>
          </div>
          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg whitespace-nowrap w-full sm:w-auto">
            詳しく見る
          </button>
        </div>
      </div>
    </div>
  );
};