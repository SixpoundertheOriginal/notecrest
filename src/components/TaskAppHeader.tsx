
import React, { ReactNode } from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobileValue } from '@/hooks/use-mobile';
import { Button } from './ui/button';

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
          <button 
            onClick={toggleTheme} 
            className="glass-button p-2 rounded-full"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default TaskAppHeader;
