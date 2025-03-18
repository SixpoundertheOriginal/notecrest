
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import UserMenu from '@/components/auth/UserMenu';
import { User } from '@/types/auth';

interface AuthSectionProps {
  user: User | null;
  onOpenAuth?: () => void;
}

const AuthSection = ({ user, onOpenAuth }: AuthSectionProps) => {
  if (user) {
    return <UserMenu userEmail={user.email || ''} />;
  }

  if (onOpenAuth) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onOpenAuth}
        className="flex items-center gap-2"
      >
        <LogIn size={16} />
        Login
      </Button>
    );
  }

  return null;
};

export default AuthSection;
