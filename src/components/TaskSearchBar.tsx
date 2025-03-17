
import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskSearchBarProps {
  darkMode: boolean;
}

const TaskSearchBar = ({ darkMode }: TaskSearchBarProps) => {
  return (
    <div className="flex-grow flex items-center rounded-lg px-3 glass-input">
      <Search size={16} className="text-gray-400" />
      <input 
        type="text" 
        placeholder="Search tasks..." 
        className="w-full p-2 bg-transparent focus:outline-none text-sm placeholder-gray-500"
      />
    </div>
  );
};

export default TaskSearchBar;
