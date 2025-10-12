/**
 * User Service
 * Handles user profile operations and user-related data
 */

import { supabase } from '../config/database';

export interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  total_roasts: number;
  total_points: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  username?: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
}

class UserService {
  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<{ profile: UserProfile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return { profile: data, error: null };
    } catch (error) {
      return { profile: null, error: error as Error };
    }
  }

  /**
   * Get current user's profile
   */
  async getCurrentUserProfile(): Promise<{ profile: UserProfile | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user');
      }

      return this.getUserProfile(user.id);
    } catch (error) {
      return { profile: null, error: error as Error };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: UpdateProfileData): Promise<{ profile: UserProfile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return { profile: data as UserProfile, error: null };
    } catch (error) {
      return { profile: null, error: error as Error };
    }
  }

  /**
   * Get user's badges
   */
  async getUserBadges(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          id,
          earned_at,
          badge:badges (
            id,
            name,
            description,
            icon,
            points_reward
          )
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) throw error;

      return { badges: data, error: null };
    } catch (error) {
      return { badges: null, error: error as Error };
    }
  }

  /**
   * Check username availability
   */
  async isUsernameAvailable(username: string): Promise<{ available: boolean; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (error) throw error;

      return { available: !data, error: null };
    } catch (error) {
      return { available: false, error: error as Error };
    }
  }

  /**
   * Get leaderboard data
   */
  async getLeaderboard(limit: number = 100) {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .limit(limit);

      if (error) throw error;

      return { leaderboard: data, error: null };
    } catch (error) {
      return { leaderboard: null, error: error as Error };
    }
  }
}

export const userService = new UserService();
