
import React, { ReactNode } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobileValue } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface TaskAppHeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  pageTitle?: string;
  rightContent?: ReactNode;
}

const TaskAppHeader = ({ darkMode, toggleTheme, pageTitle, rightContent }: TaskAppHeaderProps) => {
  const isMobile = useIsMobileValue();
  
  return (
    <header className="glass-morphism py-3 px-4 backdrop-blur-xl sticky top-0 z-30 border-b border-white/5">
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        {isMobile ? (
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2"
              onClick={() => {
                // Target the sidebar toggle button
                const sidebarToggleBtn = document.querySelector('[aria-label="Toggle sidebar"]');
                if (sidebarToggleBtn instanceof HTMLElement) {
                  sidebarToggleBtn.click();
                }
              }}
            >
              <Menu size={18} />
            </Button>
            <h1 className="text-xl font-bold">
              {pageTitle || "Taskify"}
            </h1>
          </div>
        ) : (
          <h1 className="text-xl font-bold">
            {pageTitle || "Taskify"}
          </h1>
        )}
        <div className="flex items-center gap-3">
          {rightContent}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={toggleTheme} 
                  variant="outline"
                  size="icon"
                  className={cn(
                    "rounded-full transition-all duration-300",
                    darkMode 
                      ? "bg-blue-500/30 hover:bg-blue-500/40 border-blue-500/30" 
                      : "bg-amber-500/20 hover:bg-amber-500/30 border-amber-400/30"
                  )}
                >
                  {darkMode ? (
                    <Sun size={18} className="text-blue-200" />
                  ) : (
                    <Moon size={18} className="text-amber-400" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default TaskAppHeader;
