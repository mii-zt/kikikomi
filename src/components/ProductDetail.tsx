import React, { useState } from 'react';
import { Star, Users, MessageCircle, CheckCircle, Plus, Heart, Share2, Camera, Upload, X, ArrowLeft, User } from 'lucide-react';
import { ReviewCard } from './ReviewCard';
import { ProductCommunity } from './ProductCommunity';
import { useAuth } from '../contexts/AuthContext';
import { useReviews } from '../hooks/useReviews';
import { usePurchaseVerifications } from '../hooks/usePurchaseVerifications';
import { usePoints } from '../hooks/usePoints';
import { uploadFile } from '../lib/storage-fixed';
import { generateSafeFileName, validateFileType, validateFileSize } from '../utils/fileUtils';


interface ProductDetailProps {
  productId?: string;
  onNavigateToCommunity?: () => void;
  onBack?: () => void;
  showCommunity?: boolean;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId = '00000000-0000-0000-0000-000000000001', onNavigateToCommunity, onBack, showCommunity = false }) => {
  const { user } = useAuth();
  const { reviews, loading: reviewsLoading, createReview } = useReviews(productId);
  const { createVerification, isUserVerified } = usePurchaseVerifications(user?.id);
  const { addPoints, getPointsForAction } = usePoints();
  
  // 商品データを動的に取得（実際の実装ではAPIから取得）
  const getProductData = (id: string) => {
    const products = {
      '1': {
        name: '最新スマートフォン Pro Max 256GB',
        image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=600',
        price: '¥128,800',
        rating: 4.2,
        reviewCount: 127,
        communityMembers: 342,
        description: '最新のA17 Proチップ搭載で高性能。カメラ機能も大幅に向上し、プロレベルの写真撮影が可能。バッテリー持続時間も延長され、1日フル活用できます。'
      },
      '2': {
        name: 'オーガニック美容液セット',
        image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600',
        price: '¥8,900',
        rating: 4.7,
        reviewCount: 234,
        communityMembers: 456,
        description: '天然成分100%のオーガニック美容液。肌に優しく、敏感肌の方にもおすすめ。使用感も良く、続けやすい価格設定です。'
      },
      '3': {
        name: 'カジュアルコットンワンピース',
        image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600',
        price: '¥12,800',
        rating: 4.4,
        reviewCount: 156,
        communityMembers: 234,
        description: '着心地の良いコットン素材のワンピース。カジュアルからフォーマルまで幅広く着回せるデザイン。洗濯も簡単でお手入れしやすいです。'
      },
      '4': {
        name: 'プロフェッショナルミラーレスカメラ',
        image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600',
        price: '¥245,000',
        rating: 4.8,
        reviewCount: 89,
        communityMembers: 156,
        description: '高画質撮影が可能なミラーレスカメラ。プロ仕様の機能を搭載しながらも、初心者にも使いやすい操作性。動画撮影にも対応しています。'
      }
    };
    return products[id as keyof typeof products] || products['1'];
  };
  
  const product = getProductData(productId);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [verificationType, setVerificationType] = useState<'photo' | 'receipt'>('photo');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // ファイルの検証
    const validFiles = files.filter(file => {
      if (!validateFileType(file)) {
        alert(`${file.name} は対応していないファイル形式です。JPEG、PNG、GIF、WebP形式のみ対応しています。`);
        return false;
      }
      if (!validateFileSize(file, 5)) {
        alert(`${file.name} のファイルサイズが大きすぎます。5MB以下のファイルを選択してください。`);
        return false;
      }
      return true;
    });
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleVerificationSubmit = async () => {
    if (!user) {
      alert('ログインが必要です。');
      return;
    }

    if (uploadedFiles.length === 0) {
      alert('商品写真またはレシートを1枚以上アップロードしてください。');
      return;
    }

    setIsUploading(true);
    try {
      // 最初のファイルをアップロード
      const file = uploadedFiles[0];
      // 安全なファイル名を生成
      const fileName = generateSafeFileName(file.name, user.id);
      
      const { data: fileUrl, error: uploadError } = await uploadFile(file, 'verifications', fileName);
      
      if (uploadError) {
        throw new Error(uploadError);
      }

      // 商品IDが数値の場合はUUIDに変換
      const actualProductId = productId === '1' ? '00000000-0000-0000-0000-000000000001' : 
                             productId === '2' ? '00000000-0000-0000-0000-000000000002' :
                             productId === '3' ? '00000000-0000-0000-0000-000000000003' :
                             productId === '4' ? '00000000-0000-0000-0000-000000000004' :
                             productId;

      // 購入認証データを作成
      await createVerification({
        user_id: user.id,
        product_id: actualProductId,
        verification_type: verificationType,
        file_url: fileUrl,
        status: 'pending',
      });

      // ポイントを追加
      const points = getPointsForAction('verification_upload');
      await addPoints('verification', points);

      alert(`購入確認を送信しました！\n+${points}ポイント獲得！\n審査後、購入者マークが表示されます。`);
      setShowVerificationModal(false);
      setUploadedFiles([]);
    } catch (error) {
      console.error('購入認証エラー:', error);
      alert('購入確認の送信に失敗しました。');
    } finally {
      setIsUploading(false);
    }
  };

  const handleJoinCommunity = () => {
    if (onNavigateToCommunity) {
      onNavigateToCommunity();
    }
  };

  // コミュニティ表示の場合はProductCommunityコンポーネントを表示
  if (showCommunity) {
    return (
      <ProductCommunity
        productId={productId}
        productName={product.name}
        onBack={onBack}
      />
    );
  }

  const handleReviewImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setReviewImages(prev => [...prev, ...files]);
  };

  const removeReviewImage = (index: number) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleReviewSubmit = async () => {
    if (!user) {
      alert('レビューを投稿するにはログインが必要です。');
      return;
    }

    // 購入認証の確認
    const isVerified = isUserVerified(user.id, productId);
    if (!isVerified) {
      alert('レビューを投稿するには購入認証が必要です。\nまず「購入確認を行う」ボタンから認証を完了してください。');
      setShowReviewModal(false);
      return;
    }

    if (reviewTitle.trim() && reviewContent.trim()) {
      try {
        await createReview({
          product_id: productId,
          user_id: user.id,
          user_name: user.user_metadata?.name || user.email || '匿名ユーザー',
          rating: reviewRating,
          title: reviewTitle.trim(),
          content: reviewContent.trim(),
          is_verified_purchase: true, // 購入認証済みなのでtrue
          product_usage_period: '1週間', // デフォルト値
        });

        // ポイントを追加
        const points = getPointsForAction('review_post');
        await addPoints('review', points);

        alert(`レビューを投稿しました！\n+${points}ポイント獲得！`);
        setShowReviewModal(false);
        setReviewTitle('');
        setReviewContent('');
        setReviewRating(5);
        setReviewImages([]);
      } catch (error) {
        console.error('レビュー投稿エラー:', error);
        alert('レビューの投稿に失敗しました。');
      }
    } else {
      alert('タイトルと本文を入力してください。');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 md:py-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 min-h-screen">
      {/* Back Button */}
      {onBack && (
        <div className="mb-4 sm:mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm sm:text-base font-medium">前のページに戻る</span>
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 sm:gap-4 md:gap-8">
        {/* Product Info */}
        <div className="w-full">
          {/* Product Header */}
          <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl border border-blue-100 p-3 sm:p-4 md:p-6 lg:p-8 mb-3 sm:mb-4 md:mb-6 shadow-lg max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {/* Product Image */}
              <div>
                <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                    className="w-full rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex space-x-1 sm:space-x-2">
                    <button className="p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg">
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 hover:text-red-500" />
                    </button>
                    <button className="p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg">
                      <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 hover:text-blue-500" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4 sm:space-y-6">
              <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {product.name}
                </h1>
                
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="flex items-center mr-2 sm:mr-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                    <span className="text-base sm:text-lg font-medium text-gray-700">{product.rating} / 5.0</span>
                </div>
                
                  <div className="flex items-center">
                    <div className="flex items-center bg-green-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      <span className="text-xs sm:text-sm text-green-700 ml-1.5 sm:ml-2 font-bold">購入済みレビュー</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <MessageCircle className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-2xl font-bold text-blue-700">{product.reviewCount}</span>
                    </div>
                    <p className="text-sm text-blue-600 font-medium">レビュー</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-5 w-5 text-purple-500 mr-2" />
                      <span className="text-2xl font-bold text-purple-700">{product.communityMembers}</span>
                    </div>
                    <p className="text-sm text-purple-600 font-medium">コミュニティ</p>
                  </div>
                </div>
                
                {/* Price */}
                <div className="text-center py-4">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {product.price}
                </div>
                  <p className="text-gray-600 mt-2">税込み・送料無料</p>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-4 sm:space-y-3">
                  <div className="relative">
                    <button 
                      onClick={() => setShowVerificationModal(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-full font-bold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                    >
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 inline mr-2" />
                      購入確認を行う
                    </button>
                    <div className="absolute -top-0.5 -right-0.5 sm:-top-1 md:-top-2 sm:-right-1 md:-right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[8px] sm:text-[10px] md:text-xs px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-1 rounded-full font-bold shadow-lg animate-bounce">
                      +30P
                    </div>
                  </div>

                  <div className="relative">
                    {user && isUserVerified(user.id, productId) ? (
                      // 購入認証済みの場合
                      <>
                        <button 
                          onClick={() => setShowReviewModal(true)}
                          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-full font-bold hover:from-emerald-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                        >
                          <Plus className="h-4 w-4 sm:h-5 sm:w-5 inline mr-2" />
                          レビューを書く
                        </button>
                        <div className="absolute -top-0.5 -right-0.5 sm:-top-1 md:-top-2 sm:-right-1 md:-right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[8px] sm:text-[10px] md:text-xs px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-1 rounded-full font-bold shadow-lg animate-bounce">
                          +10P
                        </div>
                      </>
                    ) : user ? (
                      // ログイン済みだが購入認証未完了の場合
                      <div className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-full font-bold text-sm sm:text-base text-center cursor-not-allowed">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 inline mr-2" />
                        購入認証後にレビュー可能
                      </div>
                    ) : (
                      // 未ログインの場合
                      <div className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-full font-bold text-sm sm:text-base text-center cursor-not-allowed">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 inline mr-2" />
                        ログイン後にレビュー可能
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={handleJoinCommunity}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-full font-bold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                    >
                      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 inline mr-2" />
                      コミュニティに参加
                </button>
                    <div className="absolute -top-0.5 -right-0.5 sm:-top-1 md:-top-2 sm:-right-1 md:-right-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white text-[8px] sm:text-[10px] md:text-xs px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-1 rounded-full font-bold shadow-lg">
                      +10P
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="bg-white rounded-2xl border border-blue-100 p-8 shadow-lg max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">みんなのレビュー</h2>
              </div>
              <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-bold">
                信頼度 98%
              </span>
            </div>
            <div className="space-y-6">
              {reviewsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">レビューを読み込み中...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">まだレビューがありません</p>
                  <p className="text-sm text-gray-400 mt-1">最初のレビューを投稿してみましょう！</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <ReviewCard 
                    key={review.id} 
                    id={review.id}
                    userId={review.user_id}
                    userName={review.user_name}
                    rating={review.rating}
                    title={review.title}
                    content={review.content}
                    date={new Date(review.created_at).toLocaleDateString('ja-JP')}
                    helpfulCount={0}
                    isVerifiedPurchase={review.is_verified_purchase}
                    productUsagePeriod={review.product_usage_period}
                    isUserVerified={review.is_user_verified}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">レビューを書く</h3>
                    <p className="text-gray-600">あなたの感想を共有しましょう</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Rating Selection */}
              <div className="mb-6">
                <label className="block text-gray-900 font-bold mb-2">
                  評価
                </label>
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setReviewRating(i + 1)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          i < reviewRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Title */}
              <div className="mb-6">
                <label className="block text-gray-900 font-bold mb-2">
                  タイトル
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="レビューのタイトルを入力..."
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                />
              </div>

              {/* Review Content */}
              <div className="mb-6">
                <label className="block text-gray-900 font-bold mb-2">
                  レビュー本文
                </label>
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="商品の感想を詳しく書いてください..."
                  className="w-full h-32 px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-300 resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-gray-900 font-bold mb-2">
                  写真を追加
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleReviewImageUpload}
                    className="hidden"
                    id="review-image-upload"
                  />
                  <label htmlFor="review-image-upload" className="cursor-pointer">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-base font-medium text-gray-700 mb-2">商品の写真を追加する</p>
                    <p className="text-sm text-gray-500">PNG、JPG、JPEG形式に対応（最大5枚まで）</p>
                  </label>
                </div>

                {/* Uploaded Images */}
                {reviewImages.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h5 className="font-medium text-gray-900">アップロード済み写真:</h5>
                    {reviewImages.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          onClick={() => removeReviewImage(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Important Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h5 className="font-bold text-blue-900 mb-2">📝 投稿のヒント</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 実際に使用した感想を具体的に書くと参考になります</li>
                  <li>• 写真があると他のユーザーの参考になります</li>
                  <li>• 商品と関係のない内容は避けましょう</li>
                  <li>• 投稿したレビューは編集できます</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleReviewSubmit}
                  disabled={!reviewTitle.trim() || !reviewContent.trim()}
                  className={`flex-1 px-6 py-3 rounded-full font-bold transition-all duration-200 transform hover:scale-105 ${
                    reviewTitle.trim() && reviewContent.trim()
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  レビューを投稿
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">購入確認</h3>
                    <p className="text-gray-600">信頼できるレビューのために購入を確認させてください</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Verification Type Selection */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">確認方法を選択してください</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setVerificationType('photo')}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      verificationType === 'photo'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <Camera className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <h5 className="font-bold text-gray-900 mb-1">商品写真</h5>
                    <p className="text-sm text-gray-600">実際の商品を撮影してアップロード</p>
                  </button>
                  
                  <button
                    onClick={() => setVerificationType('receipt')}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      verificationType === 'receipt'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <Upload className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <h5 className="font-bold text-gray-900 mb-1">レシート・領収書</h5>
                    <p className="text-sm text-gray-600">購入時のレシートをアップロード</p>
                  </button>
                </div>
              </div>

              {/* File Upload Area */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  {verificationType === 'photo' ? '商品写真をアップロード' : 'レシート・領収書をアップロード'}
                </h4>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">ファイルをドロップするか、クリックして選択</p>
                    <p className="text-sm text-gray-500">PNG、JPG、JPEG形式に対応（最大5MB）</p>
                  </label>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h5 className="font-medium text-gray-900">アップロード済みファイル:</h5>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Important Notes */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h5 className="font-bold text-blue-900 mb-2">📝 重要な注意事項</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 個人情報（住所、電話番号など）は隠してからアップロードしてください</li>
                  <li>• 画像は確認後、安全に削除されます</li>
                  <li>• 偽造や改ざんされた画像の使用は禁止されています</li>
                  <li>• 確認完了まで1-2営業日お時間をいただく場合があります</li>
                </ul>
            </div>
        
              {/* Submit Button */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowVerificationModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleVerificationSubmit}
                  disabled={uploadedFiles.length === 0 || isUploading}
                  className={`flex-1 px-6 py-3 rounded-full font-bold transition-all duration-200 transform hover:scale-105 ${
                    uploadedFiles.length > 0 && !isUploading
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isUploading ? '送信中...' : '購入確認を送信'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};