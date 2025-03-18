
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, AuthState } from '@/types/auth';

// Create auth context
const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  error: null
});

// Export hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Create AuthProvider component
export const AuthProvider = ({ children }: { children: (authState: AuthState) => ReactNode }) => {
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

  return (
    <AuthContext.Provider value={authState}>
      {children(authState)}
    </AuthContext.Provider>
  );
};
