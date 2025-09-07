import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface PurchaseVerification {
  id: string
  user_id: string
  product_id: string
  verification_type: 'photo' | 'receipt'
  file_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export const usePurchaseVerifications = (userId?: string) => {
  const [verifications, setVerifications] = useState<PurchaseVerification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      fetchVerifications(userId)
    }
  }, [userId])

  const fetchVerifications = async (userId: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('purchase_verifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setVerifications(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createVerification = async (verification: Omit<PurchaseVerification, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('purchase_verifications')
        .insert([verification])
        .select()
        .single()

      if (error) throw error
      setVerifications(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred'
      setError(error)
      return { data: null, error }
    }
  }

  const updateVerification = async (id: string, updates: Partial<PurchaseVerification>) => {
    try {
      const { data, error } = await supabase
        .from('purchase_verifications')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setVerifications(prev => prev.map(v => v.id === id ? data : v))
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred'
      setError(error)
      return { data: null, error }
    }
  }

  const isUserVerified = (userId: string, productId: string) => {
    return verifications.some(v => 
      v.user_id === userId && 
      v.product_id === productId && 
      v.status === 'approved'
    )
  }

  return {
    verifications,
    loading,
    error,
    createVerification,
    updateVerification,
    isUserVerified,
  }
}


