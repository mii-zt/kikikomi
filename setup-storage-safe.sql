-- 安全なストレージバケットの設定
-- このファイルをSupabaseのSQL Editorで実行してください

-- 購入認証用のストレージバケットを作成（存在しない場合のみ）
INSERT INTO storage.buckets (id, name, public) 
VALUES ('verifications', 'verifications', true)
ON CONFLICT (id) DO NOTHING;

-- ストレージバケットのポリシーを設定
-- 既存のポリシーを削除してから新しく作成
DO $$ 
BEGIN
    -- ポリシーが存在する場合のみ削除
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = '認証済みユーザーは購入認証ファイルをアップロード可能' AND tablename = 'objects') THEN
        DROP POLICY "認証済みユーザーは購入認証ファイルをアップロード可能" ON storage.objects;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = '認証済みユーザーは購入認証ファイルを閲覧可能' AND tablename = 'objects') THEN
        DROP POLICY "認証済みユーザーは購入認証ファイルを閲覧可能" ON storage.objects;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = '認証済みユーザーは自分の購入認証ファイルを削除可能' AND tablename = 'objects') THEN
        DROP POLICY "認証済みユーザーは自分の購入認証ファイルを削除可能" ON storage.objects;
    END IF;
END $$;

-- 新しいポリシーを作成
CREATE POLICY "認証済みユーザーは購入認証ファイルをアップロード可能" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'verifications' AND auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーは購入認証ファイルを閲覧可能" ON storage.objects
FOR SELECT USING (bucket_id = 'verifications' AND auth.role() = 'authenticated');

CREATE POLICY "認証済みユーザーは自分の購入認証ファイルを削除可能" ON storage.objects
FOR DELETE USING (bucket_id = 'verifications' AND auth.role() = 'authenticated');


