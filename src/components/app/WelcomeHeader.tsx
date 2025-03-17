
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface WelcomeHeaderProps {
  username?: string;
  isLoggedIn: boolean;
  onOpenAuth?: () => void;
}

const WelcomeHeader = ({ username, isLoggedIn, onOpenAuth }: WelcomeHeaderProps) => {
  return (
    <div className="mb-8 text-center pt-4 md:pt-0">
      <h2 className="text-2xl md:text-3xl font-light mb-2">
        Welcome to <span className="font-bold text-gradient">Taskify</span>
      </h2>
      <p className="text-sm text-white mb-4">
        {isLoggedIn 
          ? `Manage your tasks, ${username || 'User'}`
          : "Log in to save your tasks across devices"
        }
      </p>
      
      {!isLoggedIn && onOpenAuth && (
        <Button 
          onClick={onOpenAuth} 
          variant="outline" 
          className="mt-2 bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 text-blue-400"
        >
          <LogIn size={16} className="mr-1" />
          Login or Sign up
        </Button>
      )}
    </div>
  );
};

export default WelcomeHeader;
