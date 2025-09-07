// 商品別コミュニティ管理フック
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface ProductCommunity {
  id: string;
  product_id: string;
  community_name: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityTopic {
  id: string;
  community_id: string;
  topic_name: string;
  description?: string;
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useProductCommunities = (productId?: string) => {
  const [communities, setCommunities] = useState<ProductCommunity[]>([]);
  const [topics, setTopics] = useState<CommunityTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 商品のコミュニティを取得
  const fetchProductCommunity = async (productId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('product_communities')
        .select('*')
        .eq('product_id', productId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setCommunities(data ? [data] : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // コミュニティのトピックを取得
  const fetchCommunityTopics = async (communityId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_topics')
        .select('*')
        .eq('community_id', communityId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTopics(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // 商品のコミュニティを作成
  const createProductCommunity = async (productId: string, communityName: string, description?: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('ログインが必要です');
      }

      const { data, error } = await supabase
        .from('product_communities')
        .insert([{
          product_id: productId,
          community_name: communityName,
          description: description,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      setCommunities(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // トピックを作成
  const createTopic = async (communityId: string, topicName: string, description?: string) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('ログインが必要です');
      }

      const { data, error } = await supabase
        .from('community_topics')
        .insert([{
          community_id: communityId,
          topic_name: topicName,
          description: description,
          created_by: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      setTopics(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // トピックを無効化
  const deactivateTopic = async (topicId: string) => {
    try {
      const { error } = await supabase
        .from('community_topics')
        .update({ is_active: false })
        .eq('id', topicId);

      if (error) throw error;
      setTopics(prev => prev.filter(topic => topic.id !== topicId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // 商品IDが変更されたときにコミュニティを取得
  useEffect(() => {
    if (productId) {
      fetchProductCommunity(productId);
    }
  }, [productId]);

  // コミュニティが変更されたときにトピックを取得
  useEffect(() => {
    if (communities.length > 0) {
      fetchCommunityTopics(communities[0].id);
    }
  }, [communities]);

  return {
    communities,
    topics,
    loading,
    error,
    fetchProductCommunity,
    fetchCommunityTopics,
    createProductCommunity,
    createTopic,
    deactivateTopic,
  };
};


