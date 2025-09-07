import React, { useState } from 'react';
import { Users, MessageSquare, Star, Trophy, Coffee, ArrowLeft, TrendingUp, Award, Plus } from 'lucide-react';
import { CommunityChat } from './CommunityChat';

const communityStats = [
  { label: 'アクティブメンバー', value: '342人', icon: Users, color: 'from-blue-400 to-blue-600' },
  { label: '今月の投稿数', value: '1,248件', icon: MessageSquare, color: 'from-green-400 to-green-600' },
  { label: '平均評価', value: '4.6/5.0', icon: Star, color: 'from-yellow-400 to-orange-500' },
  { label: '解決済み質問', value: '89%', icon: Trophy, color: 'from-purple-400 to-purple-600' },
];

const communityRules = [
  { title: '🤝 お互いを尊重しましょう', description: '丁寧で建設的なコミュニケーションを心がけましょう' },
  { title: '📸 購入確認済みの情報を共有', description: '実際に使用した経験に基づく情報を共有してください' },
  { title: '🚫 スパムや宣伝の禁止', description: '関連性のない投稿や過度な宣伝は控えてください' },
  { title: '💡 建設的なフィードバック', description: '他の人の役に立つ具体的で役立つ情報を提供しましょう' },
];

const recentTopics = [
  { id: 'general', title: '全体の雑談', replies: 156, lastActive: '1分前', author: 'みんな', isGeneral: true },
  { id: 'battery', title: 'バッテリー持ちについて', replies: 23, lastActive: '2分前', author: 'tech_lover', isGeneral: false },
  { id: 'camera', title: 'カメラの夜景撮影のコツ', replies: 15, lastActive: '5分前', author: 'photo_fan', isGeneral: false },
  { id: 'protection', title: '保護フィルムのおすすめ', replies: 31, lastActive: '8分前', author: 'mobile_expert', isGeneral: false },
  { id: 'cases', title: 'ケースとの相性について', replies: 12, lastActive: '12分前', author: 'accessories_guru', isGeneral: false },
];

interface CommunityPageProps {
  onBack: () => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ onBack }) => {
  const [currentChatRoom, setCurrentChatRoom] = useState('general');
  
  const getCurrentTopic = () => {
    return recentTopics.find(topic => topic.id === currentChatRoom) || recentTopics[0];
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 md:py-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-0 mb-4 sm:mb-6 md:mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors sm:mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          商品詳細に戻る
        </button>
        <div className="flex items-center w-full sm:w-auto">
          <div className="w-10 h-10 sm:w-11 md:w-12 sm:h-11 md:h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 break-all sm:break-normal">最新スマートフォン Pro Max コミュニティ</h1>
            <p className="text-sm sm:text-base text-gray-600">みんなで情報を共有して、より良い商品体験を</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <div className="sticky top-0 sm:top-6 z-10">
            {/* Topic Selection Tabs */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-blue-100 shadow-lg mb-4 p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2" />
                  チャットルームを選択
                </h3>
                <button
                  onClick={() => alert('新しいチャットルームを作成')}
                  className="flex items-center justify-center sm:justify-start px-3 sm:px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors duration-200 font-medium text-sm w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  ルームを作成
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {recentTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setCurrentChatRoom(topic.id)}
                    className={`p-2 sm:p-3 rounded-xl transition-all duration-200 border text-left ${
                      currentChatRoom === topic.id
                        ? 'bg-blue-500 text-white border-blue-600 shadow-lg'
                        : 'bg-gray-50 text-gray-900 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <h4 className="text-xs sm:text-sm font-semibold line-clamp-1">{topic.title}</h4>
                      {topic.isGeneral && (
                        <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium ${
                          currentChatRoom === topic.id
                            ? 'bg-white/20 text-white'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          雑談
                        </span>
                      )}
                    </div>
                    <div className={`flex items-center text-[10px] sm:text-xs space-x-2 ${
                      currentChatRoom === topic.id ? 'text-white/80' : 'text-gray-600'
                    }`}>
                      <span>{topic.replies}件</span>
                      <span className={currentChatRoom === topic.id ? 'text-white' : 'text-green-600 font-medium'}>
                        {topic.lastActive}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Chat Room Header */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-blue-100 shadow-lg mb-4 p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                <div className="flex items-center">
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2 sm:mr-3 ${
                    getCurrentTopic().isGeneral ? 'bg-green-500' : 'bg-blue-500'
                  } animate-pulse`}></div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 truncate">{getCurrentTopic().title}</h3>
                  {getCurrentTopic().isGeneral && (
                    <span className="ml-2 sm:ml-3 bg-green-100 text-green-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                      雑談中
                    </span>
                  )}
                </div>
                <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span>{getCurrentTopic().replies}件のメッセージ</span>
                </div>
              </div>
            </div>

            <CommunityChat currentRoom={currentChatRoom} />
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
          {/* Mobile Quick Actions */}
          <div className="lg:hidden grid grid-cols-2 gap-2 sm:gap-3">
            <button 
              onClick={() => setCurrentChatRoom('general')}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-green-50 border border-green-200 hover:bg-green-100 transition-colors text-center"
            >
              <div className="text-xs sm:text-sm font-semibold text-green-800">💬 雑談に参加</div>
            </button>
            <button 
              onClick={() => setCurrentChatRoom('battery')}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors text-center"
            >
              <div className="text-xs sm:text-sm font-semibold text-blue-800">🔋 バッテリー情報</div>
            </button>
          </div>

          {/* Community Stats */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-blue-100 p-3 sm:p-4 shadow-lg">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">統計</h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:space-y-3">
              {communityStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center`}>
                      <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-base sm:text-lg font-bold text-gray-900">{stat.value}</div>
                      <div className="text-[10px] sm:text-xs text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Quick Actions */}
          <div className="hidden lg:block bg-white rounded-2xl border border-blue-100 p-4 shadow-lg">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">クイックアクション</h3>
            </div>
            <div className="space-y-3">
              <button 
                onClick={() => setCurrentChatRoom('general')}
                className="w-full p-3 rounded-lg bg-green-50 border border-green-200 hover:bg-green-100 transition-colors text-left"
              >
                <div className="text-sm font-semibold text-green-800">💬 雑談に参加</div>
                <div className="text-xs text-green-600">気軽におしゃべりしよう</div>
              </button>
              <button 
                onClick={() => setCurrentChatRoom('battery')}
                className="w-full p-3 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors text-left"
              >
                <div className="text-sm font-semibold text-blue-800">🔋 バッテリー情報</div>
                <div className="text-xs text-blue-600">持ちや充電について</div>
              </button>
            </div>
          </div>

          {/* Community Rules */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-blue-100 p-3 sm:p-4 shadow-lg">
            <div className="flex items-center mb-3 sm:mb-4">
              <Award className="h-4 w-4 text-blue-500 mr-2" />
              <h3 className="text-base sm:text-lg font-bold text-gray-900">ルール</h3>
            </div>
            <div className="space-y-2">
              {communityRules.map((rule, index) => (
                <div key={index} className="p-2 sm:p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 sm:mb-1">{rule.title}</h4>
                  <p className="text-[10px] sm:text-xs text-gray-700 line-clamp-2">{rule.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="mt-6 sm:mt-8 text-center bg-white rounded-2xl p-4 sm:p-8 shadow-lg border border-blue-100">
        <div className="flex items-center justify-center mb-4">
          <Coffee className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mr-2 sm:mr-3" />
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">コミュニティへようこそ！</h3>
        </div>
        <p className="text-base sm:text-lg text-gray-700 mb-6">
          同じ商品を愛用する仲間たちと、使い方のコツや疑問を共有しましょう。
          あなたの経験が、誰かの購入の決め手になるかもしれません。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-gray-600">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-2" />
            <span>質の高い情報交換</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 text-blue-500 mr-2" />
            <span>温かいコミュニティ</span>
          </div>
          <div className="flex items-center">
            <Trophy className="h-4 w-4 text-purple-500 mr-2" />
            <span>購入確認済みメンバー</span>
          </div>
        </div>
      </div>
    </div>
  );
};
