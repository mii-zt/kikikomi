import React, { useState, useEffect } from 'react';
import { Send, Users, Pin, Smile, Coffee, Star, CheckCircle, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChatMessages, ChatMessage } from '../hooks/useChatMessages';
import { usePoints } from '../hooks/usePoints';
import { VerifiedMark } from './VerifiedMark';

interface CommunityChatProps {
  currentRoom?: string;
}

export const CommunityChat: React.FC<CommunityChatProps> = ({ currentRoom = 'general' }) => {
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const { messages, loading, error, sendMessage } = useChatMessages(currentRoom);
  const { addPoints, getPointsForAction } = usePoints();

  const getPlaceholderText = () => {
    const placeholders: Record<string, string> = {
      general: 'みなさんとおしゃべりしよう... 😊',
      battery: 'バッテリーについて質問・情報交換... 🔋',
      camera: 'カメラ機能について語ろう... 📸',
      protection: '保護フィルムの情報を共有... 🛡️',
      cases: 'ケースについて相談しよう... 📱',
    };
    return placeholders[currentRoom] || placeholders.general;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      // メッセージを送信
      await sendMessage({
        room_id: currentRoom,
        user_id: user.id,
        user_name: user.user_metadata?.name || user.email || '匿名ユーザー',
        message: newMessage.trim(),
        is_verified_purchase: false,
        user_points: 0,
        points_earned: 5,
      });

      // ポイントを追加
      const points = getPointsForAction('chat_message');
      await addPoints('chat', points);

      setNewMessage('');
      
      // ポイント獲得を通知（オプション）
      console.log(`+${points}ポイント獲得！`);
    } catch (err) {
      console.error('メッセージ送信エラー:', err);
    }
  };

  return (
    <div id="community-chat" className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl sm:rounded-2xl border border-blue-100 h-[500px] sm:h-[550px] md:h-[600px] lg:h-[700px] flex flex-col shadow-lg">
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl sm:rounded-t-2xl">
        <div className="flex items-center">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
              {currentRoom === 'general' ? 'みんなでおしゃべり' : 
               currentRoom === 'battery' ? 'バッテリー相談' :
               currentRoom === 'camera' ? 'カメラ機能' :
               currentRoom === 'protection' ? '保護フィルム' :
               currentRoom === 'cases' ? 'ケース相談' : 'チャット'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {currentRoom === 'general' ? '自由に話そう' : 
               currentRoom === 'battery' ? 'バッテリー情報交換' :
               currentRoom === 'camera' ? 'カメラの使い方' :
               currentRoom === 'protection' ? '保護フィルム情報' :
               currentRoom === 'cases' ? 'ケース情報' : 'トピック別チャット'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1 sm:mr-2 animate-pulse"></div>
          <span className="text-xs sm:text-base text-green-700 font-bold">342人</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-3">
        {loading && (
          <div className="text-center text-gray-500 py-4">
            メッセージを読み込み中...
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 py-4">
            エラー: {error}
          </div>
        )}
        {messages.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>まだメッセージがありません</p>
            <p className="text-sm">最初のメッセージを送信してみましょう！</p>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-2 sm:space-x-3 ${
              message.is_pinned ? 'bg-yellow-50 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-yellow-200' : ''
            }`}
          >
            {message.is_pinned && (
              <Pin className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 mt-1 flex-shrink-0" />
            )}
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] sm:text-xs font-bold text-white">
                {(message.user_name || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                <span className="text-sm sm:text-base font-bold text-gray-900 truncate">
                  {message.user_name || '匿名ユーザー'}
                </span>
                {message.is_user_verified && (
                  <div className="flex items-center">
                    <VerifiedMark size="sm" />
                  </div>
                )}
                {message.is_verified_purchase && (
                  <div className="flex items-center bg-green-500 px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-1 rounded-full shadow-lg">
                    <CheckCircle className="h-2 w-2 sm:h-2.5 md:h-3 sm:w-2.5 md:w-3 text-white" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs text-white font-bold ml-0.5 sm:ml-1">購入済み</span>
                  </div>
                )}
                {message.user_points && (
                  <div className="flex items-center bg-yellow-100 px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-1 rounded-full">
                    <Star className="h-2 w-2 sm:h-2.5 md:h-3 sm:w-2.5 md:w-3 text-yellow-500 mr-0.5 sm:mr-1" />
                    <span className="text-[9px] sm:text-[10px] md:text-xs text-yellow-700 font-bold">{message.user_points}P</span>
                  </div>
                )}
                <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full font-medium">
                  {new Date(message.created_at).toLocaleTimeString('ja-JP', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 mt-1 sm:mt-2 shadow-sm relative">
                <p className="text-sm sm:text-base text-gray-800 font-medium break-words">{message.message}</p>
                {message.points_earned && (
                  <div className="absolute -top-0.5 -right-0.5 sm:-top-1 md:-top-2 sm:-right-1 md:-right-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-[8px] sm:text-[10px] md:text-xs px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-1 rounded-full font-bold shadow-lg animate-pulse">
                    +{message.points_earned}P
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-2 sm:p-4 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-xl sm:rounded-b-2xl">
        <div className="mb-2 text-center">
          <span className="text-[10px] sm:text-xs text-gray-600 bg-white px-2 sm:px-3 py-1 rounded-full shadow-sm">
            💬 メッセージ送信で +5P  |  ✨ 参考になったで +10P
          </span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-600 hover:bg-white rounded-full transition-all duration-200">
            <Smile className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={user ? getPlaceholderText() : 'ログインしてメッセージを送信...'}
            disabled={!user}
            className="chat-input flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-blue-200 rounded-full focus:ring-2 focus:ring-blue-300 focus:border-blue-300 bg-white/80 backdrop-blur-sm text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <div className="relative">
            <button 
              onClick={handleSendMessage}
              disabled={!user || !newMessage.trim()}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-2 sm:p-3 rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 transform hover:scale-110 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <div className="absolute -top-0.5 -right-0.5 sm:-top-1 md:-top-1.5 sm:-right-1 md:-right-1.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-[7px] sm:text-[8px] md:text-[10px] px-0.5 sm:px-1 py-0.5 rounded-full font-bold">
              +5P
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};