import React, { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, CheckCircle, Send, Smile, X, Image } from 'lucide-react';
import { VerifiedMark } from './VerifiedMark';
import { ReviewQuestionModal } from './ReviewQuestionModal';

interface ReviewCardProps {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpfulCount: number;
  isVerifiedPurchase: boolean;
  productUsagePeriod: string;
  isUserVerified?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  id,
  userId,
  userName,
  rating,
  title,
  content,
  date,
  helpfulCount,
  isVerifiedPurchase,
  productUsagePeriod,
  isUserVerified = false,
}) => {
  const [showDMModal, setShowDMModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [message, setMessage] = useState('');
  return (
    <div className="bg-gradient-to-br from-white to-blue-50/30 border border-blue-100 rounded-2xl p-6 hover:shadow-lg hover:border-blue-200 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-sm font-bold text-white">
              {userName.charAt(0)}
            </span>
          </div>
          <div className="ml-3">
            <div className="flex items-center">
              <h4 className="text-base font-bold text-gray-900">{userName}</h4>
              {isUserVerified && (
                <div className="ml-2">
                  <VerifiedMark size="sm" />
                </div>
              )}
              {isVerifiedPurchase && (
                <div className="ml-2 flex items-center bg-green-500 px-2 sm:px-3 py-1 rounded-full shadow-lg">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                  <span className="text-xs sm:text-sm text-white ml-1 font-bold">購入済み</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1 font-medium">
              {date} • 使用期間: {productUsagePeriod} 📅
            </p>
          </div>
        </div>
        
        <button className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-all duration-200 transform hover:scale-110">
          <Send className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-200'
            }`}
          />
        ))}
        <span className="ml-3 text-lg font-bold text-gray-900">{title}</span>
      </div>
      
      <div className="bg-white/60 rounded-xl p-4 mb-4">
        <p className="text-gray-800 text-base leading-relaxed font-medium">{content}</p>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pt-4 border-t border-blue-100">
        <button className="flex items-center justify-center sm:justify-start space-x-2 text-sm sm:text-base bg-emerald-50 text-emerald-700 px-3 sm:px-4 py-2 rounded-full hover:bg-emerald-100 transition-all duration-200 transform hover:scale-105 font-bold">
          <ThumbsUp className="h-4 w-4" />
          <span>参考になった！ ({helpfulCount})</span>
        </button>
        
        <button 
          onClick={() => setShowQuestionModal(true)}
          className="flex items-center justify-center sm:justify-start space-x-2 text-sm sm:text-base bg-blue-50 text-blue-700 px-3 sm:px-4 py-2 rounded-full hover:bg-blue-100 transition-all duration-200 transform hover:scale-105 font-bold"
        >
          <MessageCircle className="h-4 w-4" />
          <span>質問する 💬</span>
        </button>
      </div>

      {/* DM Modal */}
      {showDMModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-sm font-bold text-white">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {userName}さんに質問
                    </h3>
                    <p className="text-gray-600">
                      匿名で質問できます。商品に関する質問のみ受け付けています。
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDMModal(false)}
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
                          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900">{title}</span>
                </div>
                <p className="text-gray-700 text-sm">{content}</p>
              </div>

              {/* Message Input */}
              <div className="mb-6">
                <label className="block text-gray-900 font-bold mb-2">
                  質問内容
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="商品について気になることを質問してみましょう..."
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
                  <li>• 商品に関係のない質問はご遠慮ください</li>
                  <li>• 個人情報のやり取りは禁止されています</li>
                  <li>• 返信があるまでお待ちください（通常1-2日）</li>
                  <li>• 質問と回答は管理者が確認します</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setShowDMModal(false)}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => {
                    alert('質問を送信しました！');
                    setShowDMModal(false);
                    setMessage('');
                  }}
                  disabled={!message.trim()}
                  className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold transition-all duration-200 transform hover:scale-105 text-sm sm:text-base ${
                    message.trim()
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  質問を送信
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Question Modal */}
      <ReviewQuestionModal
        isOpen={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        reviewId={id}
        reviewerId={userId}
        reviewerName={userName}
        reviewTitle={title}
        reviewContent={content}
        reviewRating={rating}
      />
    </div>
  );
};