
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, AuthState } from '@/types/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        setAuthState({
          user: session ? session.user as User : null,
          loading: false,
          error: null
        });
      } catch (error) {
        setAuthState({
          user: null,
          loading: false,
          error: error as Error
        });
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session ? session.user as User : null,
        loading: false,
        error: null
      });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return authState;
};
