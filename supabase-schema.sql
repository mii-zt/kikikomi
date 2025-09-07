-- Supabaseデータベーススキーマ
-- このファイルをSupabaseのSQL Editorで実行してください

-- 商品テーブル
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  community_members INTEGER DEFAULT 0,
  has_verified_reviews BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- レビューテーブル
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_verified_purchase BOOLEAN DEFAULT false,
  product_usage_period VARCHAR(100) DEFAULT '1ヶ月未満',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ユーザープロフィールテーブル
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  points INTEGER DEFAULT 0,
  verified_purchases INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- チャットメッセージテーブル
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_verified_purchase BOOLEAN DEFAULT false,
  user_points INTEGER,
  points_earned INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 購入確認テーブル
CREATE TABLE IF NOT EXISTS purchase_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  verification_type VARCHAR(50) NOT NULL, -- 'photo' or 'receipt'
  file_url TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- リアルタイム機能の有効化
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE reviews;

-- RLS (Row Level Security) の設定
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_verifications ENABLE ROW LEVEL SECURITY;

-- 商品テーブルのポリシー
CREATE POLICY "商品は誰でも閲覧可能" ON products FOR SELECT USING (true);
CREATE POLICY "認証済みユーザーのみ商品作成可能" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "認証済みユーザーのみ商品更新可能" ON products FOR UPDATE USING (auth.role() = 'authenticated');

-- レビューテーブルのポリシー
CREATE POLICY "レビューは誰でも閲覧可能" ON reviews FOR SELECT USING (true);
CREATE POLICY "認証済みユーザーのみレビュー作成可能" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ユーザーは自分のレビューのみ更新可能" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "ユーザーは自分のレビューのみ削除可能" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- ユーザープロフィールテーブルのポリシー
CREATE POLICY "プロフィールは誰でも閲覧可能" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "ユーザーは自分のプロフィールのみ作成可能" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "ユーザーは自分のプロフィールのみ更新可能" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- チャットメッセージテーブルのポリシー
CREATE POLICY "チャットメッセージは誰でも閲覧可能" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "認証済みユーザーのみメッセージ送信可能" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 購入確認テーブルのポリシー
CREATE POLICY "ユーザーは自分の購入確認のみ閲覧可能" ON purchase_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "認証済みユーザーのみ購入確認作成可能" ON purchase_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ユーザーは自分の購入確認のみ更新可能" ON purchase_verifications FOR UPDATE USING (auth.uid() = user_id);

-- トリガー関数の作成（updated_atの自動更新）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガーの作成
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_verifications_updated_at BEFORE UPDATE ON purchase_verifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- サンプル商品データの挿入（ユーザー登録後に手動で追加可能）
-- INSERT INTO products (name, description, price, image_url, category, rating, review_count, community_members, has_verified_reviews) VALUES
-- ('iPhone 15 Pro', '最新のiPhone 15 Pro。A17 Proチップ搭載で高性能。', 128000, 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=600', 'スマートフォン', 4.5, 234, 456, true),
-- ('AirPods Pro', 'ノイズキャンセリング機能付きワイヤレスイヤホン', 38900, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600', 'オーディオ', 4.7, 189, 278, true),
-- ('カジュアルコットンワンピース', '着心地の良いコットン素材のワンピース', 12800, 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600', 'ファッション', 4.4, 156, 234, true),
-- ('プロフェッショナルミラーレスカメラ', '高画質撮影が可能なミラーレスカメラ', 245000, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600', 'カメラ', 4.8, 89, 156, true);
