import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth, AuthUser } from "@/lib/auth";
import type { AuthError } from "@supabase/supabase-js";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: AuthError | null;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ user: AuthUser | null; error: AuthError | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ user: AuthUser | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        const currentUser = await auth.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error("Error checking user:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = auth.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const result = await auth.signIn(email, password);
    if (result.error) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const result = await auth.signUp(email, password);
    if (result.error) {
      setError(result.error);
    }
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    const result = await auth.signOut();
    if (result.error) {
      setError(result.error);
    } else {
      setUser(null);
    }
    setLoading(false);
    return result;
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
