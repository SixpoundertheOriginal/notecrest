
import React from 'react';
import { MoonIcon, SunIcon, LogIn, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AuthSection from './app/AuthSection';
import { useAuth } from '@/hooks/useAuth';
import { Input } from './ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { SidebarTrigger } from './ui/sidebar';

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
  showSidebarTrigger?: boolean;
}

const TaskAppHeader = ({ 
  darkMode, 
  toggleTheme, 
  pageTitle, 
  isLoggedIn, 
  onOpenAuth,
  onAddTask,
  showLoginButton = true,
  showSidebarTrigger = false
}: TaskAppHeaderProps) => {
  const { user, loading } = useAuth();
  const { isMobile } = useIsMobile();
  
  return (
    <header className="px-4 py-3 flex items-center justify-between border-b border-white/5">
      <div className="flex items-center gap-2">
        {showSidebarTrigger && (
          <SidebarTrigger 
            className="h-9 w-9 flex items-center justify-center" 
            aria-label="Toggle sidebar"
          />
        )}
        <h1 className="text-lg font-medium">{pageTitle}</h1>
      </div>
      
      {/* Center search section */}
      {!isMobile && (
        <div className={cn("absolute left-1/2 transform -translate-x-1/2 max-w-md w-full flex items-center")}>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="w-full pl-10 h-9 bg-background/60 border-white/5"
            />
            <kbd className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-600 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-300 opacity-60">
              ⌘K
            </kbd>
          </div>
        </div>
      )}
      
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

        {/* Only show the login button in the header if showLoginButton is true */}
        {showLoginButton && onOpenAuth && !isLoggedIn && (
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
