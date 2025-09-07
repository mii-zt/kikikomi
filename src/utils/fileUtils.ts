// ファイル名を安全な形式に変換するユーティリティ関数

export const generateSafeFileName = (originalName: string, userId: string): string => {
  // ファイル拡張子を取得
  const extension = originalName.split('.').pop() || 'jpg';
  
  // 元のファイル名から拡張子を除く
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  
  // 安全なファイル名に変換
  const safeName = nameWithoutExt
    .replace(/[^\x00-\x7F]/g, '') // 非ASCII文字を削除
    .replace(/[^a-zA-Z0-9.-]/g, '_') // 特殊文字をアンダースコアに置換
    .replace(/_+/g, '_') // 連続するアンダースコアを1つに
    .replace(/^_|_$/g, '') // 先頭と末尾のアンダースコアを削除
    .toLowerCase(); // 小文字に変換
  
  // タイムスタンプとユーザーIDを含む安全なファイル名を生成
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  
  return `${userId}_${timestamp}_${randomSuffix}_${safeName}.${extension}`;
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};


