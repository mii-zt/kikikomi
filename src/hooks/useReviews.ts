import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface Review {
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
  is_user_verified?: boolean
}

export const useReviews = (productId?: string) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (productId) {
      fetchReviews(productId)
    } else {
      fetchAllReviews()
    }
  }, [productId])

  const fetchReviews = async (productId: string) => {
    try {
      setLoading(true)
      
      // 商品IDが数値の場合はUUIDに変換
      const actualProductId = productId === '1' ? '00000000-0000-0000-0000-000000000001' : 
                             productId === '2' ? '00000000-0000-0000-0000-000000000002' :
                             productId === '3' ? '00000000-0000-0000-0000-000000000003' :
                             productId === '4' ? '00000000-0000-0000-0000-000000000004' :
                             productId;

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', actualProductId)
        .order('created_at', { ascending: false })

      if (error) throw error

      // 各レビューのユーザー認証状態を確認
      const reviewsWithVerification = await Promise.all(
        (data || []).map(async (review) => {
          try {
            const { data: verificationData } = await supabase
              .from('purchase_verifications')
              .select('status')
              .eq('user_id', review.user_id)
              .eq('status', 'approved')
              .limit(1)

            return {
              ...review,
              is_user_verified: verificationData && verificationData.length > 0
            }
          } catch (err) {
            console.error('認証状態取得エラー:', err)
            return {
              ...review,
              is_user_verified: false
            }
          }
        })
      )

      setReviews(reviewsWithVerification)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchAllReviews = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createReview = async (review: Omit<Review, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // 商品IDが数値の場合はUUIDに変換
      const actualProductId = review.product_id === '1' ? '00000000-0000-0000-0000-000000000001' : 
                             review.product_id === '2' ? '00000000-0000-0000-0000-000000000002' :
                             review.product_id === '3' ? '00000000-0000-0000-0000-000000000003' :
                             review.product_id === '4' ? '00000000-0000-0000-0000-000000000004' :
                             review.product_id;

      const reviewData = {
        ...review,
        product_id: actualProductId
      };

      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()
        .single()

      if (error) throw error
      setReviews(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred'
      setError(error)
      return { data: null, error }
    }
  }

  const updateReview = async (id: string, updates: Partial<Review>) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setReviews(prev => prev.map(r => r.id === id ? data : r))
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred'
      setError(error)
      return { data: null, error }
    }
  }

  const deleteReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)

      if (error) throw error
      setReviews(prev => prev.filter(r => r.id !== id))
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred'
      setError(error)
      return { error }
    }
  }

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    createReview,
    updateReview,
    deleteReview,
  }
}
