
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{mode === 'login' ? 'Login' : 'Sign up'}</SheetTitle>
        </SheetHeader>
        
        <div className="py-6">
          {mode === 'login' ? (
            <LoginForm onSwitchMode={() => setMode('signup')} onSuccess={onClose} />
          ) : (
            <SignupForm onSwitchMode={() => setMode('login')} onSuccess={onClose} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AuthModal;
