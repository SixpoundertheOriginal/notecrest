
import React from 'react';
import { MoonIcon, SunIcon, LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AuthSection from './app/AuthSection';
import { useAuth } from '@/hooks/useAuth';

interface TaskAppHeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  pageTitle: string;
  isLoggedIn?: boolean;
  onOpenAuth?: () => void;
  onAddTask: (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => void;
  showLoginButton?: boolean;
}

const TaskAppHeader = ({ 
  darkMode, 
  toggleTheme, 
  pageTitle, 
  isLoggedIn, 
  onOpenAuth,
  onAddTask,
  showLoginButton = true
}: TaskAppHeaderProps) => {
  const { user, loading } = useAuth();
  
  return (
    <header className="px-4 py-3 flex items-center justify-between border-b border-white/5">
      <div className="flex items-center">
        <h1 className="text-lg font-medium ml-2 md:ml-0">{pageTitle}</h1>
      </div>
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

        {/* Always show auth status using AuthSection */}
        {loading ? (
          <div className="h-8 w-8 flex items-center justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <AuthSection 
            user={user} 
            onOpenAuth={onOpenAuth}
          />
        )}
      </div>
    </header>
  );
};

export default TaskAppHeader;
