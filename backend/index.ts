/**
 * Backend Services Index
 * Central export point for all backend services
 */

export { authService } from './services/auth.service';
export type { SignUpData, SignInData, AuthResponse } from './services/auth.service';

export { userService } from './services/user.service';
export type { UserProfile, UpdateProfileData } from './services/user.service';

export { roastService } from './services/roast.service';
export type { CreateRoastData, Roast } from './services/roast.service';

export { supabase } from './config/database';
export type { SupabaseClient } from './config/database';
