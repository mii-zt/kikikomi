-- 既存データの確認
-- このファイルをSupabaseのSQL Editorで実行してください

-- 既存の商品データを確認
SELECT id, name, category FROM products ORDER BY created_at;

-- 既存のレビューデータを確認
SELECT id, product_id, user_name, title, created_at FROM reviews ORDER BY created_at DESC LIMIT 10;

-- 既存の購入認証データを確認
SELECT id, user_id, product_id, verification_type, status, created_at FROM purchase_verifications ORDER BY created_at DESC LIMIT 10;


