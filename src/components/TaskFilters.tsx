
import React from 'react';
import { ListFilter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  darkMode: boolean;
}

const TaskFilters = ({ darkMode }: TaskFiltersProps) => {
  return (
    <div className="flex space-x-2">
      <button className={cn(
        "px-3 py-2 rounded-lg flex items-center text-sm",
        darkMode 
          ? 'bg-[#2D3343] hover:bg-[#353D52] border border-[#353D52]' 
          : 'bg-gray-100/70 hover:bg-gray-200/70 border border-gray-200'
      )}>
        <ListFilter size={14} className="mr-1" />
        <span>List</span>
      </button>
      <button className={cn(
        "px-3 py-2 rounded-lg flex items-center text-sm",
        darkMode 
          ? 'bg-[#2D3343] hover:bg-[#353D52] border border-[#353D52]' 
          : 'bg-gray-100/70 hover:bg-gray-200/70 border border-gray-200'
      )}>
        By Priority
      </button>
    </div>
  );
};

export default TaskFilters;
