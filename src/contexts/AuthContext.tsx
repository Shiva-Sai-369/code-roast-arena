/**
 * Auth Context
 * Provides authentication state and methods throughout the application
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { authService } from "../../backend/services/auth.service";
import {
  userService,
  type UserProfile,
} from "../../backend/services/user.service";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    username?: string,
    displayName?: string
  ) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    const { profile: userProfile } = await userService.getUserProfile(userId);
    setProfile(userProfile);
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  useEffect(() => {
    // Check active session
    authService.getSession().then(({ session }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadProfile(currentUser.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    username?: string,
    displayName?: string
  ) => {
    const { error, user: newUser } = await authService.signUp({
      email,
      password,
      username,
      displayName,
    });

    if (!error && newUser) {
      setUser(newUser);
      await loadProfile(newUser.id);
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error, user: signedInUser } = await authService.signIn({
      email,
      password,
    });

    if (!error && signedInUser) {
      setUser(signedInUser);
      await loadProfile(signedInUser.id);
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await authService.signOut();

    if (!error) {
      setUser(null);
      setProfile(null);
    }

    return { error };
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
