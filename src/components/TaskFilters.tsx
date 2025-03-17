
import React from 'react';
import { ListFilter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobileValue } from '@/hooks/use-mobile';

interface TaskFiltersProps {
  darkMode: boolean;
}

const TaskFilters = ({ darkMode }: TaskFiltersProps) => {
  const isMobile = useIsMobileValue();
  
  return (
    <div className="flex space-x-2 overflow-x-auto pb-1">
      <button className="glass-button px-3 py-2 rounded-lg flex items-center text-sm whitespace-nowrap">
        <ListFilter size={14} className="mr-1" />
        <span>List</span>
      </button>
      <button className="glass-button px-3 py-2 rounded-lg flex items-center text-sm whitespace-nowrap">
        By Priority
      </button>
    </div>
  );
};

export default TaskFilters;
