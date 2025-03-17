
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskAppHeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

const TaskAppHeader = ({ darkMode, toggleTheme }: TaskAppHeaderProps) => {
  return (
    <header className={cn(
      "p-4 backdrop-blur-xl sticky top-0 z-30",
      darkMode ? 'bg-gray-950/80 border-b border-gray-800' : 'bg-white/80 border-b border-gray-200'
    )}>
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        <h1 className="text-xl font-bold text-gradient">Taskify</h1>
        <button 
          onClick={toggleTheme} 
          className={cn(
            "p-2 rounded-full transition-all duration-300",
            darkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          )}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};

export default TaskAppHeader;
