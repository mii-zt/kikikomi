import React, { useState } from 'react';
import { X, Send, MessageCircle, User, Star, Image, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDMMessages } from '../hooks/useDMMessages';

interface ReviewQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewId: string;
  reviewerId: string;
  reviewerName: string;
  reviewTitle: string;
  reviewContent: string;
  reviewRating: number;
}

export const ReviewQuestionModal: React.FC<ReviewQuestionModalProps> = ({
  isOpen,
  onClose,
  reviewId,
  reviewerId,
  reviewerName,
  reviewTitle,
  reviewContent,
  reviewRating,
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useDMMessages(reviewId);

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;

    try {
      setIsSending(true);
      await sendMessage({
        review_id: reviewId,
        sender_id: user.id,
        receiver_id: reviewerId,
        message: message.trim(),
        image_url: null,
        is_read: false,
      });
      setMessage('');
    } catch (err) {
      console.error('メッセージ送信エラー:', err);
      alert('メッセージの送信に失敗しました');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mr-4">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {reviewerName}さんに質問
                </h3>
                <p className="text-gray-600">
                  レビューに関する質問を送信できます
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Review Context */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center mb-2">
              <div className="flex items-center mr-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-gray-900">{reviewTitle}</span>
            </div>
            <p className="text-gray-700 text-sm">{reviewContent}</p>
          </div>

          {/* Messages */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">会話履歴</h4>
            <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto">
              {loading ? (
                <div className="text-center text-gray-500 py-4">
                  メッセージを読み込み中...
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  まだメッセージがありません
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.sender_id === user?.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border border-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(msg.created_at).toLocaleString('ja-JP')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div className="mb-6">
            <label className="block text-gray-900 font-bold mb-2">
              質問内容
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="レビューについて質問してみましょう..."
              className="w-full h-32 px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
              <Image className="h-5 w-5 mr-2" />
              画像を添付する
            </button>
            <p className="text-sm text-gray-600 mt-1">
              商品に関する画像があれば添付できます（任意）
            </p>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <h5 className="font-bold text-yellow-900 mb-2">📝 注意事項</h5>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• レビューに関係のない質問はご遠慮ください</li>
              <li>• 個人情報のやり取りは禁止されています</li>
              <li>• 返信があるまでお待ちください（通常1-2日）</li>
              <li>• 質問と回答は管理者が確認します</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              キャンセル
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending}
              className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold transition-all duration-200 transform hover:scale-105 text-sm sm:text-base ${
                message.trim() && !isSending
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSending ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  送信中...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Send className="h-4 w-4 mr-2" />
                  質問を送信
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
