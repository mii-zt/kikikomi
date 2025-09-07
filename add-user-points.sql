-- ユーザーポイントテーブルの作成
CREATE TABLE IF NOT EXISTS user_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  review_points INTEGER DEFAULT 0,
  chat_points INTEGER DEFAULT 0,
  verification_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);
CREATE INDEX IF NOT EXISTS idx_user_points_total_points ON user_points(total_points DESC);

-- RLSポリシーの設定
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のポイントのみ閲覧可能
CREATE POLICY "ユーザーは自分のポイントのみ閲覧可能" ON user_points FOR SELECT USING (
  auth.uid() = user_id
);

-- 認証済みユーザーのみポイント作成可能
CREATE POLICY "認証済みユーザーのみポイント作成可能" ON user_points FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- ユーザーは自分のポイントのみ更新可能
CREATE POLICY "ユーザーは自分のポイントのみ更新可能" ON user_points FOR UPDATE USING (
  auth.uid() = user_id
);

-- トリガーの作成
CREATE TRIGGER update_user_points_updated_at 
  BEFORE UPDATE ON user_points 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


