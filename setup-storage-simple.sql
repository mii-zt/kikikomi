-- シンプルなストレージバケットの設定
-- このファイルをSupabaseのSQL Editorで実行してください

-- 購入認証用のストレージバケットを作成
INSERT INTO storage.buckets (id, name, public) 
VALUES ('verifications', 'verifications', true)
ON CONFLICT (id) DO NOTHING;

-- ストレージバケットのポリシーを設定
CREATE POLICY "verifications_upload_policy" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'verifications' AND auth.role() = 'authenticated');

CREATE POLICY "verifications_view_policy" ON storage.objects
FOR SELECT USING (bucket_id = 'verifications' AND auth.role() = 'authenticated');

CREATE POLICY "verifications_delete_policy" ON storage.objects
FOR DELETE USING (bucket_id = 'verifications' AND auth.role() = 'authenticated');


