import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface DMMessage {
  id: string
  review_id: string
  sender_id: string
  receiver_id: string
  message: string
  image_url: string | null
  is_read: boolean
  created_at: string
  updated_at: string
  sender_name?: string
  receiver_name?: string
}

export const useDMMessages = (reviewId: string) => {
  const [messages, setMessages] = useState<DMMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (reviewId) {
      fetchMessages()
      
      // リアルタイム購読を設定
      const subscription = supabase
        .channel(`dm_messages:review_id=eq.${reviewId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'dm_messages',
            filter: `review_id=eq.${reviewId}`,
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as DMMessage])
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'dm_messages',
            filter: `review_id=eq.${reviewId}`,
          },
          (payload) => {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === payload.new.id ? payload.new as DMMessage : msg
              )
            )
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [reviewId])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('dm_messages')
        .select('*')
        .eq('review_id', reviewId)
        .order('created_at', { ascending: true })

      if (error) throw error

      // ユーザー名を個別に取得
      const formattedMessages = await Promise.all(
        (data || []).map(async (msg) => {
          try {
            // 送信者名を取得
            const { data: senderData } = await supabase
              .from('user_profiles')
              .select('name')
              .eq('id', msg.sender_id)
              .single()

            // 受信者名を取得
            const { data: receiverData } = await supabase
              .from('user_profiles')
              .select('name')
              .eq('id', msg.receiver_id)
              .single()

            return {
              ...msg,
              sender_name: senderData?.name || '不明なユーザー',
              receiver_name: receiverData?.name || '不明なユーザー'
            }
          } catch (err) {
            console.error('ユーザー名取得エラー:', err)
            return {
              ...msg,
              sender_name: '不明なユーザー',
              receiver_name: '不明なユーザー'
            }
          }
        })
      )

      setMessages(formattedMessages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (message: Omit<DMMessage, 'id' | 'created_at' | 'updated_at' | 'sender_name' | 'receiver_name'>) => {
    try {
      const { data, error } = await supabase
        .from('dm_messages')
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

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('dm_messages')
        .update({ is_read: true })
        .eq('id', messageId)

      if (error) throw error
    } catch (err) {
      console.error('既読マークエラー:', err)
    }
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    fetchMessages,
  }
}
