-- 既存データの更新（重複エラーを避ける）
-- このファイルをSupabaseのSQL Editorで実行してください

-- 既存の商品データを更新（存在しない場合のみ挿入）
INSERT INTO products (id, name, description, price, image_url, category, rating, review_count, community_members, has_verified_reviews) 
VALUES ('00000000-0000-0000-0000-000000000001', '最新スマートフォン Pro Max', '最新のスマートフォン Pro Max。高性能チップ搭載で最高の体験を。', 128000, 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=600', 'スマートフォン', 4.5, 234, 456, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  community_members = EXCLUDED.community_members,
  has_verified_reviews = EXCLUDED.has_verified_reviews,
  updated_at = NOW();

INSERT INTO products (id, name, description, price, image_url, category, rating, review_count, community_members, has_verified_reviews) 
VALUES ('00000000-0000-0000-0000-000000000002', 'AirPods Pro', 'ノイズキャンセリング機能付きワイヤレスイヤホン', 38900, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600', 'オーディオ', 4.7, 189, 278, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  community_members = EXCLUDED.community_members,
  has_verified_reviews = EXCLUDED.has_verified_reviews,
  updated_at = NOW();

INSERT INTO products (id, name, description, price, image_url, category, rating, review_count, community_members, has_verified_reviews) 
VALUES ('00000000-0000-0000-0000-000000000003', 'カジュアルコットンワンピース', '着心地の良いコットン素材のワンピース', 12800, 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=600', 'ファッション', 4.4, 156, 234, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  community_members = EXCLUDED.community_members,
  has_verified_reviews = EXCLUDED.has_verified_reviews,
  updated_at = NOW();

INSERT INTO products (id, name, description, price, image_url, category, rating, review_count, community_members, has_verified_reviews) 
VALUES ('00000000-0000-0000-0000-000000000004', 'プロフェッショナルミラーレスカメラ', '高画質撮影が可能なミラーレスカメラ', 245000, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=600', 'カメラ', 4.8, 89, 156, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  community_members = EXCLUDED.community_members,
  has_verified_reviews = EXCLUDED.has_verified_reviews,
  updated_at = NOW();


