-- Seed data for badges and initial setup

-- Insert default badges
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
