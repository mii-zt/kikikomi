import { supabase } from './lib/supabase'

// Supabase接続テスト
export const testSupabaseConnection = async () => {
  try {
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
    console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '設定済み' : '未設定')
    
    const { data, error } = await supabase.from('products').select('count')
    
    if (error) {
      console.error('Supabase接続エラー:', error)
      return false
    }
    
    console.log('Supabase接続成功:', data)
    return true
  } catch (err) {
    console.error('接続テストエラー:', err)
    return false
  }
}


