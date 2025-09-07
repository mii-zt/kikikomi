import { createClient } from '@supabase/supabase-js'

// Supabaseの設定
if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('環境変数 VITE_SUPABASE_URL が設定されていません。.env.local ファイルを確認してください。');
}
if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('環境変数 VITE_SUPABASE_ANON_KEY が設定されていません。.env.local ファイルを確認してください。');
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// デバッグ用：環境変数の確認
console.log('Supabase URL:', supabaseUrl.replace(/^https:\/\//, ''))  // URLの一部のみを表示
console.log('Supabase Key:', 'configured')

// Supabaseクライアントの作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// データベースの型定義
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          category: string
          rating: number
          review_count: number
          community_members: number
          has_verified_reviews: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          category: string
          rating?: number
          review_count?: number
          community_members?: number
          has_verified_reviews?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          category?: string
          rating?: number
          review_count?: number
          community_members?: number
          has_verified_reviews?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          user_name: string
          rating: number
          title: string
          content: string
          is_verified_purchase: boolean
          product_usage_period: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          user_name: string
          rating: number
          title: string
          content: string
          is_verified_purchase?: boolean
          product_usage_period?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          user_name?: string
          rating?: number
          title?: string
          content?: string
          is_verified_purchase?: boolean
          product_usage_period?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          points: number
          verified_purchases: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          points?: number
          verified_purchases?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          points?: number
          verified_purchases?: number
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          room_id: string
          user_id: string
          user_name: string
          message: string
          is_verified_purchase: boolean
          user_points: number | null
          points_earned: number | null
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          user_id: string
          user_name: string
          message: string
          is_verified_purchase?: boolean
          user_points?: number | null
          points_earned?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          user_id?: string
          user_name?: string
          message?: string
          is_verified_purchase?: boolean
          user_points?: number | null
          points_earned?: number | null
          created_at?: string
        }
      }
    }
  }
}
