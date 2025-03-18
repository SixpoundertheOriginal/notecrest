
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ 
  children 
}: { 
  children: ((props: { user: User | null, loading: boolean }) => React.ReactNode) | React.ReactNode 
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session?.user) {
        const { id, email } = data.session.user;
        setUser({ id, email: email || '' });
      }
      
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { id, email } = session.user;
          setUser({ id, email: email || '' });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.user) {
        const { id, email } = data.user;
        setUser({ id, email: email || '' });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
  
  if (typeof children === 'function') {
    return (
      <AuthContext.Provider value={value}>
        {children({ user, loading })}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
