
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import UserMenu from '@/components/auth/UserMenu';
import AuthModal from '@/components/auth/AuthModal';

interface AuthSectionProps {
  user: any;
}

const AuthSection = ({ user }: AuthSectionProps) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (user) {
    return <UserMenu userEmail={user.email || ''} />;
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsAuthModalOpen(true)}
        className="flex items-center gap-2"
      >
        <LogIn size={16} />
        Login
      </Button>
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default AuthSection;
