-- ============================================================================
-- Code Roast Arena - Complete Database Migration
-- Run this entire file in your Supabase SQL Editor to set up the database
-- ============================================================================

-- This migration includes:
-- 1. Schema creation (tables, RLS policies, functions, triggers)
-- 2. Initial data seeding (badges)
-- Run this ONCE in a new Supabase project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STEP 1: CREATE TABLES
-- ============================================================================

-- Users Table (Extended Profile)
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

-- Roasts Table
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

-- Badges Table
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER,
  points_reward INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Badges Table
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Roast Likes Table
CREATE TABLE IF NOT EXISTS public.roast_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roast_id UUID NOT NULL REFERENCES public.roasts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(roast_id, user_id)
);

-- ============================================================================
-- STEP 2: ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roast_likes ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: CREATE RLS POLICIES
-- ============================================================================

-- Users Policies
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Roasts Policies
CREATE POLICY "Anyone can view public roasts" ON public.roasts FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Authenticated users can insert roasts" ON public.roasts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own roasts" ON public.roasts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own roasts" ON public.roasts FOR DELETE USING (auth.uid() = user_id);

-- Badges Policies
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);

-- User Badges Policies
CREATE POLICY "Anyone can view user badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Authenticated users can earn badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Roast Likes Policies
CREATE POLICY "Anyone can view likes" ON public.roast_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like roasts" ON public.roast_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own likes" ON public.roast_likes FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- STEP 4: CREATE FUNCTIONS
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

-- Function to check and award badges
CREATE OR REPLACE FUNCTION public.check_and_award_badges(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  user_roasts INTEGER;
  user_points INTEGER;
  badge_record RECORD;
BEGIN
  SELECT total_roasts, total_points INTO user_roasts, user_points
  FROM public.users WHERE id = user_uuid;

  FOR badge_record IN 
    SELECT * FROM public.badges 
    WHERE id NOT IN (
      SELECT badge_id FROM public.user_badges WHERE user_id = user_uuid
    )
  LOOP
    IF (badge_record.requirement_type = 'roast_count' AND user_roasts >= badge_record.requirement_value) OR
       (badge_record.requirement_type = 'points' AND user_points >= badge_record.requirement_value) THEN
      
      INSERT INTO public.user_badges (user_id, badge_id)
      VALUES (user_uuid, badge_record.id);
      
      UPDATE public.users
      SET total_points = total_points + badge_record.points_reward
      WHERE id = user_uuid;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 5: CREATE TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_roast_created ON public.roasts;
CREATE TRIGGER on_roast_created
  AFTER INSERT ON public.roasts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_stats_on_roast();

DROP TRIGGER IF EXISTS on_roast_like_change ON public.roast_likes;
CREATE TRIGGER on_roast_like_change
  AFTER INSERT OR DELETE ON public.roast_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_roast_likes_count();

-- ============================================================================
-- STEP 6: CREATE VIEWS
-- ============================================================================

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
-- STEP 7: CREATE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_roasts_user_id ON public.roasts(user_id);
CREATE INDEX IF NOT EXISTS idx_roasts_created_at ON public.roasts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_roasts_public ON public.roasts(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_roast_likes_roast_id ON public.roast_likes(roast_id);
CREATE INDEX IF NOT EXISTS idx_roast_likes_user_id ON public.roast_likes(user_id);

-- ============================================================================
-- STEP 8: SEED INITIAL DATA
-- ============================================================================

INSERT INTO public.badges (name, description, icon, requirement_type, requirement_value, points_reward) VALUES
  ('First Roast', 'Generated your first code roast', '🔥', 'roast_count', 1, 10),
  ('Roast Novice', 'Generated 10 roasts', '🌟', 'roast_count', 10, 50),
  ('Roast Expert', 'Generated 50 roasts', '⭐', 'roast_count', 50, 200),
  ('Roast Master', 'Generated 100 roasts', '🏆', 'roast_count', 100, 500),
  ('Point Collector', 'Earned 100 points', '💯', 'points', 100, 50),
  ('Point Hoarder', 'Earned 500 points', '💰', 'points', 500, 200),
  ('Point Legend', 'Earned 1000 points', '👑', 'points', 1000, 500),
  ('Early Adopter', 'One of the first users', '🚀', 'special', 0, 100),
  ('Code Critic', 'Received 50 likes on roasts', '👍', 'special', 0, 150),
  ('Viral Roaster', 'Received 200 likes on roasts', '🌟', 'special', 0, 300)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- You should now have:
-- ✓ All tables created
-- ✓ RLS policies enabled
-- ✓ Triggers and functions set up
-- ✓ Initial badges seeded
--
-- Next steps:
-- 1. Set up environment variables in your app
-- 2. Test user registration
-- 3. Deploy your Edge Function for roast generation
-- ============================================================================
