-- DMメッセージテーブルの作成
CREATE TABLE IF NOT EXISTS dm_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  image_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_dm_messages_review_id ON dm_messages(review_id);
CREATE INDEX IF NOT EXISTS idx_dm_messages_sender_id ON dm_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_dm_messages_receiver_id ON dm_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_dm_messages_created_at ON dm_messages(created_at);

-- RLSポリシーの設定
ALTER TABLE dm_messages ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分が送信者または受信者のDMのみ閲覧可能
CREATE POLICY "ユーザーは自分のDMのみ閲覧可能" ON dm_messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);

-- 認証済みユーザーのみDM送信可能
CREATE POLICY "認証済みユーザーのみDM送信可能" ON dm_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id
);

-- ユーザーは自分のDMのみ更新可能（既読状態など）
CREATE POLICY "ユーザーは自分のDMのみ更新可能" ON dm_messages FOR UPDATE USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);

-- トリガーの作成
CREATE TRIGGER update_dm_messages_updated_at 
  BEFORE UPDATE ON dm_messages 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


