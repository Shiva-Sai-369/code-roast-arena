/**
 * Roast Service
 * Handles roast generation, storage, and roast-related operations
 */

import { supabase } from '../config/database';

export interface CreateRoastData {
  code: string;
  language: string;
  roast_content: string;
  severity_level?: number;
  is_public?: boolean;
}

export interface Roast {
  id: string;
  user_id: string;
  code: string;
  language: string;
  roast_content: string;
  severity_level: number;
  is_public: boolean;
  likes_count: number;
  created_at: string;
}

class RoastService {
  /**
   * Generate a roast using Supabase Edge Function
   */
  async generateRoast(code: string, language: string): Promise<{ roast: string | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-roast', {
        body: { code, language },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      return { roast: data.roast, error: null };
    } catch (error) {
      return { roast: null, error: error as Error };
    }
  }

  /**
   * Save a roast to the database
   */
  async saveRoast(roastData: CreateRoastData): Promise<{ roast: Roast | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to save roasts');
      }

      const { data, error } = await supabase
        .from('roasts')
        .insert({
          user_id: user.id,
          code: roastData.code,
          language: roastData.language,
          roast_content: roastData.roast_content,
          severity_level: roastData.severity_level || 1,
          is_public: roastData.is_public ?? true,
        })
        .select()
        .single();

      if (error) throw error;

      // Check and award badges
      await supabase.rpc('check_and_award_badges', { user_uuid: user.id });

      return { roast: data as Roast, error: null };
    } catch (error) {
      return { roast: null, error: error as Error };
    }
  }

  /**
   * Get user's roasts
   */
  async getUserRoasts(userId: string, limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from('roasts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { roasts: data, error: null };
    } catch (error) {
      return { roasts: null, error: error as Error };
    }
  }

  /**
   * Get public roasts (for feed/explore)
   */
  async getPublicRoasts(limit: number = 50, offset: number = 0) {
    try {
      const { data, error } = await supabase
        .from('roasts')
        .select(`
          *,
          user:users (
            id,
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { roasts: data, error: null };
    } catch (error) {
      return { roasts: null, error: error as Error };
    }
  }

  /**
   * Get a single roast by ID
   */
  async getRoastById(roastId: string) {
    try {
      const { data, error } = await supabase
        .from('roasts')
        .select(`
          *,
          user:users (
            id,
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('id', roastId)
        .single();

      if (error) throw error;

      return { roast: data, error: null };
    } catch (error) {
      return { roast: null, error: error as Error };
    }
  }

  /**
   * Like a roast
   */
  async likeRoast(roastId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to like roasts');
      }

      const { error } = await supabase
        .from('roast_likes')
        .insert({
          roast_id: roastId,
          user_id: user.id,
        });

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  /**
   * Unlike a roast
   */
  async unlikeRoast(roastId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to unlike roasts');
      }

      const { error } = await supabase
        .from('roast_likes')
        .delete()
        .eq('roast_id', roastId)
        .eq('user_id', user.id);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }

  /**
   * Check if user has liked a roast
   */
  async hasUserLikedRoast(roastId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { liked: false, error: null };
      }

      const { data, error } = await supabase
        .from('roast_likes')
        .select('id')
        .eq('roast_id', roastId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      return { liked: !!data, error: null };
    } catch (error) {
      return { liked: false, error: error as Error };
    }
  }

  /**
   * Delete a roast
   */
  async deleteRoast(roastId: string) {
    try {
      const { error } = await supabase
        .from('roasts')
        .delete()
        .eq('id', roastId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }
}

export const roastService = new RoastService();
