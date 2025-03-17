
import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskSearchBarProps {
  darkMode: boolean;
}

const TaskSearchBar = ({ darkMode }: TaskSearchBarProps) => {
  return (
    <div className={cn(
      "flex-grow flex items-center rounded-xl px-3",
      darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-100/70 border border-gray-200'
    )}>
      <Search size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
      <input 
        type="text" 
        placeholder="Search tasks..." 
        className={cn(
          "w-full p-2 bg-transparent focus:outline-none text-sm",
          darkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'
        )}
      />
    </div>
  );
};

export default TaskSearchBar;
