// 商品別コミュニティコンポーネント
import React, { useState } from 'react';
import { Plus, MessageCircle, Users, Hash, Settings, X } from 'lucide-react';
import { useProductCommunities, CommunityTopic } from '../hooks/useProductCommunities';
import { useChatMessages } from '../hooks/useChatMessages';
import { useAuth } from '../contexts/AuthContext';
import { usePoints } from '../hooks/usePoints';

interface ProductCommunityProps {
  productId: string;
  productName: string;
  onBack?: () => void;
}

export const ProductCommunity: React.FC<ProductCommunityProps> = ({ 
  productId, 
  productName, 
  onBack 
}) => {
  const { user } = useAuth();
  const { addPoints, getPointsForAction } = usePoints();
  const { 
    communities, 
    topics, 
    loading, 
    error, 
    createProductCommunity, 
    createTopic 
  } = useProductCommunities(productId);

  const [selectedTopic, setSelectedTopic] = useState<string>('general');
  const [newMessage, setNewMessage] = useState('');
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDescription, setNewTopicDescription] = useState('');

  // チャットメッセージの管理
  const { messages, sendMessage } = useChatMessages(selectedTopic);

  // コミュニティが存在しない場合は作成
  React.useEffect(() => {
    if (communities.length === 0 && !loading && user) {
      createProductCommunity(
        productId, 
        `${productName}コミュニティ`,
        `${productName}について語り合いましょう！`
      );
    }
  }, [communities, loading, user, productId, productName, createProductCommunity]);

  // メッセージ送信
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || communities.length === 0) return;

    try {
      await sendMessage({
        room_id: selectedTopic,
        user_id: user.id,
        user_name: user.user_metadata?.name || user.email || '匿名ユーザー',
        message: newMessage.trim(),
        is_verified_purchase: false,
        user_points: 0,
        points_earned: 2,
        community_id: communities[0].id,
        topic_id: topics.find(t => t.topic_name === selectedTopic)?.id,
      });

      // ポイントを追加
      const points = getPointsForAction('chat_message');
      await addPoints('chat', points);

      setNewMessage('');
    } catch (err) {
      console.error('メッセージ送信エラー:', err);
    }
  };

  // トピック作成
  const handleCreateTopic = async () => {
    if (!newTopicName.trim() || communities.length === 0) return;

    try {
      await createTopic(
        communities[0].id,
        newTopicName.trim(),
        newTopicDescription.trim()
      );

      setNewTopicName('');
      setNewTopicDescription('');
      setShowCreateTopic(false);
    } catch (err) {
      console.error('トピック作成エラー:', err);
    }
  };

  // プレースホルダーテキストの取得
  const getPlaceholderText = () => {
    const placeholders: Record<string, string> = {
      general: 'みなさんとおしゃべりしよう... 😊',
      battery: 'バッテリーについて質問・情報交換... 🔋',
      camera: 'カメラ機能について語ろう... 📸',
      protection: '保護フィルムの情報を共有... 🛡️',
      cases: 'ケースについて相談しよう... 📱',
    };
    return placeholders[selectedTopic] || placeholders.general;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 md:py-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">コミュニティを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 md:py-6">
        <div className="text-center py-8">
          <p className="text-red-600">エラー: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 md:py-6">
      {/* ヘッダー */}
      <div className="mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 group mb-4"
          >
            <X className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-medium">前のページに戻る</span>
          </button>
        )}
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {communities[0]?.community_name || `${productName}コミュニティ`}
            </h1>
            <p className="text-gray-600">
              {communities[0]?.description || `${productName}について語り合いましょう！`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* サイドバー - トピック一覧 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">トピック</h3>
              <button
                onClick={() => setShowCreateTopic(true)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                title="トピックを追加"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {/* デフォルトトピック */}
              <button
                onClick={() => setSelectedTopic('general')}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedTopic === 'general'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  <span className="font-medium">一般</span>
                </div>
              </button>

              {/* 動的トピック */}
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.topic_name)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedTopic === topic.topic_name
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    <span className="font-medium">{topic.topic_name}</span>
                  </div>
                  {topic.description && (
                    <p className="text-xs text-gray-500 mt-1">{topic.description}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* メイン - チャットエリア */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
            {/* チャットヘッダー */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedTopic === 'general' ? '一般' : selectedTopic}
                </h2>
              </div>
            </div>

            {/* メッセージエリア */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>まだメッセージがありません</p>
                  <p className="text-sm">最初のメッセージを送信してみましょう！</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">
                        {(message.user_name || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-900">
                          {message.user_name || '匿名ユーザー'}
                        </span>
                        {message.is_verified_purchase && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            購入済み
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          {new Date(message.created_at).toLocaleTimeString('ja-JP', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 break-words">
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* メッセージ入力エリア */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={getPlaceholderText()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  送信
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* トピック作成モーダル */}
      {showCreateTopic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">新しいトピックを作成</h3>
              <button
                onClick={() => setShowCreateTopic(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  トピック名
                </label>
                <input
                  type="text"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="例: バッテリーについて"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  説明（任意）
                </label>
                <textarea
                  value={newTopicDescription}
                  onChange={(e) => setNewTopicDescription(e.target.value)}
                  placeholder="トピックの説明を入力してください"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateTopic(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleCreateTopic}
                disabled={!newTopicName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                作成
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

