import { createClient } from "@supabase/supabase-js";
import { supabase } from "./supabase/client";
import type { User, AuthError } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email?: string;
  username?: string;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: AuthError | null;
}

// Auth functions
export const auth = {
  // Sign up with email and password
  async signUp(
    email: string,
    password: string
  ): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    return {
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email,
            username: data.user.user_metadata?.username,
          }
        : null,
      error,
    };
  },

  // Sign in with email and password
  async signIn(
    email: string,
    password: string
  ): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return {
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email,
            username: data.user.user_metadata?.username,
          }
        : null,
      error,
    };
  },

  // Sign out
  async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user
      ? {
          id: user.id,
          email: user.email,
          username: user.user_metadata?.username,
        }
      : null;
  },

  // Subscribe to auth changes
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user
        ? {
            id: session.user.id,
            email: session.user.email,
            username: session.user.user_metadata?.username,
          }
        : null;
      callback(user);
    });
  },
};
