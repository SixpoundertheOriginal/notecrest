
/**
 * Auth User type for the application
 */
export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}
