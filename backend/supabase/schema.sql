-- Code Roast Arena Database Schema
-- This schema includes all tables, RLS policies, and functions for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE (Extended Profile)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  total_roasts INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles
CREATE POLICY "Users can view all profiles"
  ON public.users
  FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- ROASTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.roasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  roast_content TEXT NOT NULL,
  severity_level INTEGER DEFAULT 1 CHECK (severity_level BETWEEN 1 AND 5),
  is_public BOOLEAN DEFAULT true,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on roasts table
ALTER TABLE public.roasts ENABLE ROW LEVEL SECURITY;

-- Anyone can view public roasts
CREATE POLICY "Anyone can view public roasts"
  ON public.roasts
  FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

-- Authenticated users can insert roasts
CREATE POLICY "Authenticated users can insert roasts"
  ON public.roasts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own roasts
CREATE POLICY "Users can update own roasts"
  ON public.roasts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own roasts
CREATE POLICY "Users can delete own roasts"
  ON public.roasts
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- BADGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  requirement_type TEXT NOT NULL, -- 'roast_count', 'points', 'special'
  requirement_value INTEGER,
  points_reward INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on badges table
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- Anyone can view badges
CREATE POLICY "Anyone can view badges"
  ON public.badges
  FOR SELECT
  USING (true);

-- ============================================================================
-- USER_BADGES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Enable RLS on user_badges table
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Anyone can view user badges
CREATE POLICY "Anyone can view user badges"
  ON public.user_badges
  FOR SELECT
  USING (true);

-- System can insert user badges (handled by triggers)
CREATE POLICY "Authenticated users can earn badges"
  ON public.user_badges
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- ROAST_LIKES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.roast_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roast_id UUID NOT NULL REFERENCES public.roasts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(roast_id, user_id)
);

-- Enable RLS on roast_likes table
ALTER TABLE public.roast_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can view likes
CREATE POLICY "Anyone can view likes"
  ON public.roast_likes
  FOR SELECT
  USING (true);

-- Authenticated users can like roasts
CREATE POLICY "Authenticated users can like roasts"
  ON public.roast_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their own likes
CREATE POLICY "Users can remove own likes"
  ON public.roast_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    SPLIT_PART(NEW.email, '@', 1),
    SPLIT_PART(NEW.email, '@', 1)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update user stats after roast creation
CREATE OR REPLACE FUNCTION public.update_user_stats_on_roast()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET 
    total_roasts = total_roasts + 1,
    total_points = total_points + (NEW.severity_level * 10),
    updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update user stats
DROP TRIGGER IF EXISTS on_roast_created ON public.roasts;
CREATE TRIGGER on_roast_created
  AFTER INSERT ON public.roasts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_stats_on_roast();

-- Function to update likes count
CREATE OR REPLACE FUNCTION public.update_roast_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.roasts
    SET likes_count = likes_count + 1
    WHERE id = NEW.roast_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.roasts
    SET likes_count = likes_count - 1
    WHERE id = OLD.roast_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update likes count
DROP TRIGGER IF EXISTS on_roast_like_change ON public.roast_likes;
CREATE TRIGGER on_roast_like_change
  AFTER INSERT OR DELETE ON public.roast_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_roast_likes_count();

-- Function to check and award badges
CREATE OR REPLACE FUNCTION public.check_and_award_badges(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  user_roasts INTEGER;
  user_points INTEGER;
  badge_record RECORD;
BEGIN
  -- Get user stats
  SELECT total_roasts, total_points INTO user_roasts, user_points
  FROM public.users WHERE id = user_uuid;

  -- Check for eligible badges
  FOR badge_record IN 
    SELECT * FROM public.badges 
    WHERE id NOT IN (
      SELECT badge_id FROM public.user_badges WHERE user_id = user_uuid
    )
  LOOP
    IF (badge_record.requirement_type = 'roast_count' AND user_roasts >= badge_record.requirement_value) OR
       (badge_record.requirement_type = 'points' AND user_points >= badge_record.requirement_value) THEN
      
      -- Award badge
      INSERT INTO public.user_badges (user_id, badge_id)
      VALUES (user_uuid, badge_record.id);
      
      -- Add points reward
      UPDATE public.users
      SET total_points = total_points + badge_record.points_reward
      WHERE id = user_uuid;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Leaderboard view
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  u.id,
  u.username,
  u.display_name,
  u.avatar_url,
  u.total_roasts,
  u.total_points,
  COUNT(DISTINCT ub.badge_id) as badges_count,
  RANK() OVER (ORDER BY u.total_points DESC, u.total_roasts DESC) as rank
FROM public.users u
LEFT JOIN public.user_badges ub ON u.id = ub.user_id
GROUP BY u.id, u.username, u.display_name, u.avatar_url, u.total_roasts, u.total_points
ORDER BY u.total_points DESC, u.total_roasts DESC;

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_roasts_user_id ON public.roasts(user_id);
CREATE INDEX IF NOT EXISTS idx_roasts_created_at ON public.roasts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_roasts_public ON public.roasts(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_roast_likes_roast_id ON public.roast_likes(roast_id);
CREATE INDEX IF NOT EXISTS idx_roast_likes_user_id ON public.roast_likes(user_id);
