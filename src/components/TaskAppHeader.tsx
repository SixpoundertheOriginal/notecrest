
import React, { ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskAppHeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  rightContent?: ReactNode;
}

const TaskAppHeader = ({ darkMode, toggleTheme, rightContent }: TaskAppHeaderProps) => {
  return (
    <header className="glass-morphism py-3 px-4 backdrop-blur-xl sticky top-0 z-30 border-b border-white/5">
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        <h1 className="text-xl font-bold text-gradient">Taskify</h1>
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
