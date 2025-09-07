import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface ChatMessage {
  id: string
  room_id: string
  user_id: string
  user_name: string
  message: string
  is_verified_purchase: boolean
  user_points: number | null
  points_earned: number | null
  created_at: string
  is_user_verified?: boolean
}

export const useChatMessages = (roomId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMessages()
    
    // リアルタイム購読を設定
    const subscription = supabase
      .channel(`chat_messages:room_id=eq.${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as ChatMessage])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [roomId])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })

      if (error) throw error

      // 各メッセージのユーザー認証状態を確認
      const messagesWithVerification = await Promise.all(
        (data || []).map(async (message) => {
          const { data: verificationData } = await supabase
            .from('purchase_verifications')
            .select('status')
            .eq('user_id', message.user_id)
            .eq('status', 'approved')
            .limit(1)

          return {
            ...message,
            is_user_verified: verificationData && verificationData.length > 0
          }
        })
      )

      setMessages(messagesWithVerification)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (message: Omit<ChatMessage, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([message])
        .select()
        .single()

      if (error) throw error
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred'
      setError(error)
      return { data: null, error }
    }
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
  }
}
