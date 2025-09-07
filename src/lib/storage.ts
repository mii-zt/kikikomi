import { supabase } from './supabase'

// ファイル名をサニタイズする関数
const sanitizeFileName = (fileName: string): string => {
  // 日本語文字を削除し、特殊文字を置換
  return fileName
    .replace(/[^\x00-\x7F]/g, '') // 非ASCII文字を削除
    .replace(/[^a-zA-Z0-9.-]/g, '_') // 特殊文字をアンダースコアに置換
    .replace(/_+/g, '_') // 連続するアンダースコアを1つに
    .replace(/^_|_$/g, '') // 先頭と末尾のアンダースコアを削除
    .toLowerCase() // 小文字に変換
}

export const uploadFile = async (file: File, bucket: string, path: string) => {
  try {
    // ファイル名をサニタイズ
    const sanitizedPath = sanitizeFileName(path)
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(sanitizedPath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(sanitizedPath)

    return { data: publicUrl, error: null }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Upload failed'
    return { data: null, error }
  }
}

export const deleteFile = async (bucket: string, path: string) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
    return { error: null }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Delete failed'
    return { error }
  }
}
