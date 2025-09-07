import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  review_points: number;
  chat_points: number;
  verification_points: number;
  created_at: string;
  updated_at: string;
}

export const usePoints = () => {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserPoints();
      
      // リアルタイム更新のためのサブスクリプション
      const subscription = supabase
        .channel('user_points_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_points',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('ポイント更新を受信:', payload);
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              setUserPoints(payload.new as UserPoints);
            } else if (payload.eventType === 'DELETE') {
              setUserPoints(null);
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setUserPoints(null);
      setLoading(false);
    }
  }, [user]);

  const fetchUserPoints = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (data) {
        setUserPoints(data);
      } else {
        // ユーザーポイントレコードが存在しない場合は作成
        await createUserPoints();
      }
    } catch (err) {
      console.error('ポイント取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  const createUserPoints = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_points')
        .insert([{
          user_id: user.id,
          total_points: 0,
          review_points: 0,
          chat_points: 0,
          verification_points: 0,
        }])
        .select()
        .single();

      if (error) throw error;
      setUserPoints(data);
    } catch (err) {
      console.error('ポイント作成エラー:', err);
    }
  };

  const addPoints = async (type: 'review' | 'chat' | 'verification', points: number) => {
    if (!user) return;

    try {
      // まず現在のポイントを取得
      const { data: currentData, error: fetchError } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      let currentPoints = currentData || {
        total_points: 0,
        review_points: 0,
        chat_points: 0,
        verification_points: 0,
      };

      const updateData = {
        total_points: currentPoints.total_points + points,
        [`${type}_points`]: currentPoints[`${type}_points`] + points,
        updated_at: new Date().toISOString(),
      };

      // 即座にUIを更新（楽観的更新）
      const optimisticUpdate = {
        ...currentPoints,
        ...updateData,
        user_id: user.id,
        id: currentData?.id || 'temp',
        created_at: currentData?.created_at || new Date().toISOString(),
      };
      setUserPoints(optimisticUpdate);

      // ポイント獲得の通知（オプション）
      if (points > 0) {
        console.log(`🎉 +${points}ポイント獲得！ (${type})`);
        // ブラウザ通知（ユーザーが許可している場合）
        if (Notification.permission === 'granted') {
          new Notification('ポイント獲得！', {
            body: `+${points}ポイント獲得しました！`,
            icon: '/favicon.ico'
          });
        }
      }

      // データベースを更新（ON CONFLICTを使用した安全なupsert）
      const { data, error } = await supabase
        .from('user_points')
        .upsert({
          user_id: user.id,
          ...updateData,
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('ポイント更新エラー:', error);
        // エラー時は再取得して現在の状態を確認
        await fetchUserPoints();
        throw error;
      }
      
      // 最終的なデータで更新
      setUserPoints(data);
      return data;
    } catch (err) {
      console.error('ポイント追加エラー:', err);
      // エラー時は再取得
      await fetchUserPoints();
      throw err;
    }
  };

  const getPointsForAction = (action: string): number => {
    const pointsMap: Record<string, number> = {
      'review_post': 10,
      'review_helpful': 5,
      'chat_message': 2,
      'verification_upload': 15,
      'verification_approved': 30,
      'first_review': 20,
      'daily_login': 1,
    };
    return pointsMap[action] || 0;
  };

  return {
    userPoints,
    loading,
    addPoints,
    getPointsForAction,
    fetchUserPoints,
  };
};
