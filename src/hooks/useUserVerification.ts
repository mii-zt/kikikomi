import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useUserVerification = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setIsVerified(false);
      setLoading(false);
      return;
    }

    checkVerificationStatus();
  }, [user]);

  const checkVerificationStatus = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('purchase_verifications')
        .select('status')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .limit(1);

      if (error) throw error;
      setIsVerified(data && data.length > 0);
    } catch (err) {
      console.error('認証状態確認エラー:', err);
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  };

  return { isVerified, loading, checkVerificationStatus };
};


