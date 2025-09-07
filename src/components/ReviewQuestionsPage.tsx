import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, User, Star, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { VerifiedMark } from './VerifiedMark';

interface ReviewQuestion {
  id: string;
  review_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  image_url: string | null;
  is_read: boolean;
  created_at: string;
  review_title: string;
  review_content: string;
  review_rating: number;
  reviewer_name: string;
  sender_name: string;
}

export const ReviewQuestionsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<ReviewQuestion | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dm_messages')
        .select('*')
        .eq('receiver_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // レビュー情報とユーザー名を個別に取得
      const formattedQuestions = await Promise.all(
        (data || []).map(async (q) => {
          // レビュー情報を取得
          const { data: reviewData } = await supabase
            .from('reviews')
            .select('title, content, rating, user_name')
            .eq('id', q.review_id)
            .single()

          // 送信者名を取得
          const { data: senderData } = await supabase
            .from('user_profiles')
            .select('name')
            .eq('id', q.sender_id)
            .single()

          return {
            ...q,
            review_title: reviewData?.title || '不明なレビュー',
            review_content: reviewData?.content || '',
            review_rating: reviewData?.rating || 0,
            reviewer_name: reviewData?.user_name || '不明なユーザー',
            sender_name: senderData?.name || '質問者'
          };
        })
      );

      setQuestions(formattedQuestions);
    } catch (err) {
      console.error('質問取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedQuestion || !user) return;

    try {
      setIsReplying(true);
      const { error } = await supabase
        .from('dm_messages')
        .insert([{
          review_id: selectedQuestion.review_id,
          sender_id: user.id,
          receiver_id: selectedQuestion.sender_id,
          message: replyMessage.trim(),
          image_url: null,
          is_read: false,
        }]);

      if (error) throw error;

      setReplyMessage('');
      setSelectedQuestion(null);
      alert('返信を送信しました！');
      fetchQuestions();
    } catch (err) {
      console.error('返信送信エラー:', err);
      alert('返信の送信に失敗しました');
    } finally {
      setIsReplying(false);
    }
  };

  const markAsRead = async (questionId: string) => {
    try {
      await supabase
        .from('dm_messages')
        .update({ is_read: true })
        .eq('id', questionId);
      
      fetchQuestions();
    } catch (err) {
      console.error('既読マークエラー:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">質問を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">レビュー質問</h1>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-600">
                {questions.length}件の質問
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">質問がありません</h3>
            <p className="text-gray-500">レビューに対する質問が届いたらここに表示されます</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Questions List */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">受信した質問</h2>
              {questions.map((question) => (
                <div
                  key={question.id}
                  className={`bg-white rounded-lg border p-4 cursor-pointer hover:shadow-md transition-shadow ${
                    selectedQuestion?.id === question.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    setSelectedQuestion(question);
                    if (!question.is_read) {
                      markAsRead(question.id);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {question.review_title}
                        </h3>
                        {!question.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {question.message}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(question.created_at).toLocaleDateString('ja-JP')}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">
                          {question.reviewer_name}さんのレビュー
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {question.review_rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Question Detail and Reply */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {selectedQuestion ? (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">質問の詳細</h3>
                  
                  {/* Review Context */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < selectedQuestion.review_rating ? 'text-yellow-400 fill-current' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-gray-900">{selectedQuestion.review_title}</span>
                    </div>
                    <p className="text-sm text-gray-700">{selectedQuestion.review_content}</p>
                  </div>

                  {/* Question */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">質問内容</h4>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-gray-800">{selectedQuestion.message}</p>
                    </div>
                  </div>

                  {/* Reply Form */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      返信内容
                    </label>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="質問への回答を入力してください..."
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  <button
                    onClick={handleReply}
                    disabled={!replyMessage.trim() || isReplying}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      replyMessage.trim() && !isReplying
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isReplying ? '送信中...' : '返信を送信'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">質問を選択してください</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
