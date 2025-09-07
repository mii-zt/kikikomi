-- 商品別コミュニティテーブルの追加
CREATE TABLE IF NOT EXISTS product_communities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  community_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id)
);

-- コミュニティトピックテーブル
CREATE TABLE IF NOT EXISTS community_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES product_communities(id) ON DELETE CASCADE,
  topic_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- チャットメッセージテーブルを拡張
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS community_id UUID REFERENCES product_communities(id) ON DELETE CASCADE;
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS topic_id UUID REFERENCES community_topics(id) ON DELETE CASCADE;

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_product_communities_product_id ON product_communities(product_id);
CREATE INDEX IF NOT EXISTS idx_community_topics_community_id ON community_topics(community_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_community_id ON chat_messages(community_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_topic_id ON chat_messages(topic_id);

-- RLSポリシーの設定
ALTER TABLE product_communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_topics ENABLE ROW LEVEL SECURITY;

-- コミュニティの閲覧権限（認証済みユーザーは全員閲覧可能）
CREATE POLICY "認証済みユーザーはコミュニティを閲覧可能" ON product_communities FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "認証済みユーザーはコミュニティを作成可能" ON product_communities FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- トピックの閲覧権限
CREATE POLICY "認証済みユーザーはトピックを閲覧可能" ON community_topics FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "認証済みユーザーはトピックを作成可能" ON community_topics FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- チャットメッセージの権限を更新
CREATE POLICY "コミュニティメッセージの閲覧権限" ON chat_messages FOR SELECT USING (
  auth.role() = 'authenticated' AND (
    room_id IS NOT NULL OR 
    community_id IS NOT NULL
  )
);

CREATE POLICY "コミュニティメッセージの投稿権限" ON chat_messages FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND (
    room_id IS NOT NULL OR 
    community_id IS NOT NULL
  )
);

-- トリガーの作成
CREATE TRIGGER update_product_communities_updated_at 
  BEFORE UPDATE ON product_communities 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_topics_updated_at 
  BEFORE UPDATE ON community_topics 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


