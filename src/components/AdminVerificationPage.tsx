import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Clock, User, Package, FileImage } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface VerificationItem {
  id: string;
  user_id: string;
  product_id: string;
  verification_type: 'photo' | 'receipt';
  file_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user_name?: string;
  product_name?: string;
}

export const AdminVerificationPage: React.FC = () => {
  const [verifications, setVerifications] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<VerificationItem | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('purchase_verifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // ユーザー名と商品名を個別に取得
      const formattedData = await Promise.all(
        (data || []).map(async (item) => {
          // ユーザー名を取得
          const { data: userData } = await supabase
            .from('user_profiles')
            .select('name')
            .eq('id', item.user_id)
            .single();

          // 商品名を取得
          const { data: productData } = await supabase
            .from('products')
            .select('name')
            .eq('id', item.product_id)
            .single();

          return {
            ...item,
            user_name: userData?.name || '不明なユーザー',
            product_name: productData?.name || '不明な商品'
          };
        })
      );

      setVerifications(formattedData);
    } catch (err) {
      console.error('審査データ取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateVerificationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('purchase_verifications')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // ローカル状態を更新
      setVerifications(prev => 
        prev.map(v => v.id === id ? { ...v, status, updated_at: new Date().toISOString() } : v)
      );

      alert(`審査を${status === 'approved' ? '承認' : '拒否'}しました`);
    } catch (err) {
      console.error('審査更新エラー:', err);
      alert('審査の更新に失敗しました');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return '承認済み';
      case 'rejected': return '拒否';
      default: return '審査中';
    }
  };

  const getTypeText = (type: string) => {
    return type === 'photo' ? '商品写真' : 'レシート';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">審査データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">購入認証審査</h1>
          <p className="mt-2 text-gray-600">アップロードされた購入証明書を審査してください</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 審査リスト */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">審査待ち一覧</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {verifications.map((verification) => (
                  <div key={verification.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {verification.file_url ? (
                            <img
                              src={verification.file_url}
                              alt="認証画像"
                              className="h-16 w-16 object-cover rounded-lg cursor-pointer"
                              onClick={() => {
                                setSelectedVerification(verification);
                                setShowImageModal(true);
                              }}
                            />
                          ) : (
                            <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <FileImage className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              {verification.user_name}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(verification.status)}`}>
                              {getStatusText(verification.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{verification.product_name}</p>
                          <p className="text-xs text-gray-500">
                            {getTypeText(verification.verification_type)} • 
                            {new Date(verification.created_at).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {verification.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateVerificationStatus(verification.id, 'approved')}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              承認
                            </button>
                            <button
                              onClick={() => updateVerificationStatus(verification.id, 'rejected')}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              拒否
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setSelectedVerification(verification);
                            setShowImageModal(true);
                          }}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          詳細
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 統計情報 */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">審査統計</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">審査中</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {verifications.filter(v => v.status === 'pending').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">承認済み</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {verifications.filter(v => v.status === 'approved').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">拒否</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {verifications.filter(v => v.status === 'rejected').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 画像詳細モーダル */}
        {showImageModal && selectedVerification && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">認証画像詳細</h3>
                  <button
                    onClick={() => setShowImageModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ユーザー</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedVerification.user_name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">商品</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedVerification.product_name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">認証タイプ</label>
                    <p className="mt-1 text-sm text-gray-900">{getTypeText(selectedVerification.verification_type)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">アップロード日時</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedVerification.created_at).toLocaleString('ja-JP')}
                    </p>
                  </div>
                  
                  {selectedVerification.file_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">認証画像</label>
                      <img
                        src={selectedVerification.file_url}
                        alt="認証画像"
                        className="max-w-full h-auto rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                  
                  {selectedVerification.status === 'pending' && (
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={() => {
                          updateVerificationStatus(selectedVerification.id, 'approved');
                          setShowImageModal(false);
                        }}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        承認
                      </button>
                      <button
                        onClick={() => {
                          updateVerificationStatus(selectedVerification.id, 'rejected');
                          setShowImageModal(false);
                        }}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        拒否
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
