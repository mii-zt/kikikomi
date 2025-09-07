import React from 'react';
import { TrendingUp, Star, Award, Sparkles, Coffee, Users, MessageCircle, Trophy, Crown, Search } from 'lucide-react';
import { ProductCard } from './ProductCard';

interface HomePageProps {
  onNavigateToProduct?: (productId: string) => void;
}

const featuredProducts = [
  {
    id: '1',
    name: '最新スマートフォン Pro Max 256GB',
    image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.2,
    reviewCount: 127,
    price: '¥128,800',
    communityMembers: 342,
    hasVerifiedReviews: true,
  },
  {
    id: '2',
    name: 'オーガニック美容液セット',
    image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.7,
    reviewCount: 234,
    price: '¥8,900',
    communityMembers: 456,
    hasVerifiedReviews: true,
  },
  {
    id: '3',
    name: 'カジュアルコットンワンピース',
    image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.4,
    reviewCount: 189,
    price: '¥12,800',
    communityMembers: 278,
    hasVerifiedReviews: true,
  },
  {
    id: '4',
    name: 'プロフェッショナルミラーレスカメラ',
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.8,
    reviewCount: 89,
    price: '¥245,000',
    communityMembers: 156,
    hasVerifiedReviews: true,
  },
];

const trendingCategories = [
  { name: 'コスメ 💄', growth: '+45%', icon: TrendingUp, color: 'from-pink-400 to-rose-600' },
  { name: 'ファッション 👗', growth: '+38%', icon: Star, color: 'from-purple-400 to-violet-600' },
  { name: 'スマートフォン 📱', growth: '+24%', icon: Award, color: 'from-blue-400 to-blue-600' },
];

const topContributors = [
  { rank: 1, name: 'レビューマスター', points: 15450, reviews: 89, badge: '👑' },
  { rank: 2, name: 'コスメ専門家', points: 12890, reviews: 67, badge: '🥈' },
  { rank: 3, name: 'ガジェット王', points: 11230, reviews: 54, badge: '🥉' },
  { rank: 4, name: 'ファッション通', points: 9876, reviews: 43, badge: '⭐' },
  { rank: 5, name: 'みんなの友達', points: 8765, reviews: 38, badge: '✨' },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToProduct }) => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 md:py-6">
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-10 lg:p-12 xl:p-16 text-white mb-6 sm:mb-8 md:mb-12 lg:mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 sm:w-80 md:w-96 h-48 sm:h-80 md:h-96 bg-white/10 rounded-full -translate-y-24 sm:-translate-y-40 md:-translate-y-48 translate-x-24 sm:translate-x-40 md:translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-36 sm:w-60 md:w-72 h-36 sm:h-60 md:h-72 bg-white/10 rounded-full translate-y-18 sm:translate-y-30 md:translate-y-36 -translate-x-18 sm:-translate-x-30 md:-translate-x-36"></div>
          <div className="absolute top-1/2 right-1/4 w-24 sm:w-40 md:w-48 h-24 sm:h-40 md:h-48 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/3 w-12 sm:w-20 md:w-24 h-12 sm:h-20 md:h-24 bg-white/10 rounded-full"></div>
          <div className="max-w-4xl relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4 sm:mb-6 md:mb-8">
              <div className="bg-white/20 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl backdrop-blur-sm mb-3 sm:mb-4 md:mb-0">
                <Sparkles className="h-6 w-6 sm:h-8 md:h-10 lg:h-12 sm:w-8 md:w-10 lg:w-12 text-yellow-300" />
              </div>
              <div className="sm:ml-4 md:ml-6 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2 md:mb-3">キキコミ</h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white/90">
                  みんなで作る、<br />やさしいレビュー
                </h2>
              </div>
            </div>
            <div className="sm:ml-[60px] md:ml-[88px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all duration-200">
                  <div className="flex items-center mb-2">
                    <Award className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300 mr-2" />
                    <h4 className="text-base sm:text-lg font-bold text-white">本物のレビューだけ 🏆</h4>
                  </div>
                  <p className="text-sm sm:text-base text-white/90">実際に購入した人だけが投稿できる安心レビュー</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all duration-200">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300 mr-2" />
                    <h4 className="text-base sm:text-lg font-bold text-white">みんなでおしゃべり 💬</h4>
                  </div>
                  <p className="text-sm sm:text-base text-white/90">商品別コミュニティで楽しく情報交換</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 hover:bg-white/20 transition-all duration-200 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center mb-2">
                    <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300 mr-2" />
                    <h4 className="text-base sm:text-lg font-bold text-white">こっそり質問 🤫</h4>
                  </div>
                  <p className="text-sm sm:text-base text-white/90">レビュアーに匿名で気軽に質問</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/10 to-transparent"></div>
        </div>
      </div>

      {/* Search Section */}
      <div className="relative -mt-3 sm:-mt-4 md:-mt-6 lg:-mt-8 mb-6 sm:mb-8 md:mb-12 lg:mb-16 px-3 sm:px-4 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="どんな商品をお探しですか？ 😊"
              className="w-full pl-10 sm:pl-12 md:pl-14 lg:pl-16 pr-3 sm:pr-4 md:pr-6 py-3 sm:py-4 md:py-5 lg:py-6 text-sm sm:text-base md:text-lg lg:text-xl border-2 border-blue-200 rounded-full focus:ring-4 focus:ring-blue-300/20 focus:border-blue-300 bg-white shadow-xl hover:shadow-2xl transition-all duration-200 outline-none"
            />
            <div className="absolute left-3 sm:left-4 md:left-5 lg:left-6 top-1/2 -translate-y-1/2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-1.5 sm:p-2 md:p-2.5 shadow-lg">
              <Search className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <div className="absolute right-3 sm:right-4 md:right-5 lg:right-6 top-1/2 -translate-y-1/2 flex items-center space-x-1 sm:space-x-2 text-gray-400">
              <kbd className="hidden md:inline-block px-2 py-1 text-sm bg-gray-100 border border-gray-200 rounded-lg">⌘</kbd>
              <kbd className="hidden md:inline-block px-2 py-1 text-sm bg-gray-100 border border-gray-200 rounded-lg">K</kbd>
            </div>
          </div>
          <div className="absolute inset-x-0 top-full mt-2 sm:mt-3 md:mt-4 flex justify-center px-3 sm:px-4">
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 md:gap-2 text-xs sm:text-sm text-gray-600">
              <span className="font-medium">人気の検索:</span>
              <button className="px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 bg-white hover:bg-gray-50 rounded-full border border-gray-200 transition-colors duration-200 text-xs sm:text-sm">
                最新スマートフォン
              </button>
              <button className="px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 bg-white hover:bg-gray-50 rounded-full border border-gray-200 transition-colors duration-200 text-xs sm:text-sm">
                ワイヤレスイヤホン
              </button>
              <button className="px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 bg-white hover:bg-gray-50 rounded-full border border-gray-200 transition-colors duration-200 text-xs sm:text-sm">
                美容液
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 md:gap-0 mb-4 sm:mb-6 md:mb-8 lg:mb-10">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl">
                <Star className="h-6 w-6 sm:h-8 md:h-10 lg:h-12 sm:w-8 md:w-10 lg:w-12 text-yellow-500" />
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 ml-2 sm:ml-3 md:ml-4 lg:ml-6">みんなのおすすめ商品</h3>
            </div>
            <button className="text-blue-600 text-sm sm:text-base md:text-lg lg:text-xl font-bold hover:text-blue-700 bg-blue-50 px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 md:py-4 lg:py-5 rounded-full transition-all duration-200 hover:bg-blue-100 w-full sm:w-auto">
              もっと見る
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-10">
            {featuredProducts.map((product) => (
              <div 
                key={product.id} 
                className="transform hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => onNavigateToProduct?.(product.id)}
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>

        {/* Point Ranking Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                <Trophy className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-500" />
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 ml-2 sm:ml-3">今月の貢献者ランキング</h3>
            </div>
            <button className="text-yellow-600 text-sm sm:text-base font-bold hover:text-yellow-700 bg-yellow-50 px-3 sm:px-4 py-2 rounded-full transition-all duration-200 hover:bg-yellow-100 flex items-center justify-center w-full sm:w-auto">
              ランキングをもっと見る
              <Trophy className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 text-yellow-500" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {topContributors.map((contributor, index) => (
              <div
                key={contributor.rank}
                className={`bg-white rounded-lg sm:rounded-xl border p-3 sm:p-4 transition-all duration-200 hover:shadow-md ${
                  index === 0 ? 'border-yellow-200 bg-yellow-50/50' :
                  index === 1 ? 'border-gray-200 bg-gray-50/50' :
                  index === 2 ? 'border-orange-200 bg-orange-50/50' :
                  'border-gray-100'
                }`}
              >
                <div className="flex items-center mb-2 sm:mb-3">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white' :
                    'bg-gradient-to-br from-blue-400 to-indigo-500 text-white'
                  }`}>
                    {contributor.badge}
                  </div>
                  <div className="ml-2 sm:ml-3">
                    <div className="flex items-center text-yellow-600">
                      <Star className="h-2.5 w-2.5 sm:h-3 md:h-4 sm:w-3 md:w-4 mr-0.5 sm:mr-1" />
                      <span className="text-xs sm:text-sm md:text-lg font-bold">{contributor.points.toLocaleString()}P</span>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500">#{contributor.rank}</span>
                  </div>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900 truncate">{contributor.name}</h4>
                <p className="text-xs sm:text-sm text-gray-600">{contributor.reviews}件のレビュー</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Categories */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
            <div className="flex items-center">
              <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 ml-3 sm:ml-4">人気急上昇中！</h3>
            </div>
            <div className="bg-yellow-100 p-1.5 sm:p-2 rounded-lg sm:rounded-xl ml-0 sm:ml-4">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {trendingCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div
                  key={category.name}
                  className="bg-white border border-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="text-center">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                      <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{category.name}</h4>
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                      {category.growth}
                    </span>
                    <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 font-medium">今週の成長率</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-blue-100">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">一緒にキキコミを盛り上げませんか？ 🎉</h3>
          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 font-medium">あなたのレビューが、誰かの素敵な出会いのきっかけになります</p>
          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg w-full sm:w-auto">
            今すぐ参加する 💖
          </button>
        </div>
      </div>
    </div>
  );
};