
import React from 'react';
import { MoonIcon, SunIcon, Search, LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button"
import AuthSection from './app/AuthSection';
import { useAuth } from '@/hooks/useAuth';

interface TaskAppHeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  pageTitle: string;
  isLoggedIn?: boolean;
  onOpenAuth?: () => void;
}

const TaskAppHeader = ({ darkMode, toggleTheme, pageTitle, isLoggedIn, onOpenAuth }: TaskAppHeaderProps) => {
  const { user, loading } = useAuth();
  
  return (
    <header className="px-4 py-3 flex items-center justify-between border-b border-white/5">
      <h1 className="text-lg font-medium">{pageTitle}</h1>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </Button>

        {onOpenAuth && !isLoggedIn && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onOpenAuth}
            className="flex items-center gap-2"
          >
            <LogIn size={16} />
            Login
          </Button>
        )}

        {loading ? null : <AuthSection user={user} />}
      </div>
    </header>
  );
};

export default TaskAppHeader;
