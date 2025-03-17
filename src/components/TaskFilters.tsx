
import React from 'react';
import { ListFilter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  darkMode: boolean;
}

const TaskFilters = ({ darkMode }: TaskFiltersProps) => {
  return (
    <div className="flex space-x-2">
      <button className="glass-button px-3 py-2 rounded-lg flex items-center text-sm">
        <ListFilter size={14} className="mr-1" />
        <span>List</span>
      </button>
      <button className="glass-button px-3 py-2 rounded-lg flex items-center text-sm">
        By Priority
      </button>
    </div>
  );
};

export default TaskFilters;
