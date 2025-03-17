
import React from 'react';
import { cn } from '@/lib/utils';

interface TaskActionButtonsProps {
  darkMode: boolean;
}

const TaskActionButtons = ({ darkMode }: TaskActionButtonsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-2 border-t border-dashed">
      <button className={cn(
        "px-3 py-1.5 rounded-lg text-xs transition-colors duration-200 min-h-[44px] min-w-[44px]",
        darkMode
          ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
      )}>
        Cancel
      </button>
      <button className={cn(
        "px-3 py-1.5 rounded-lg text-xs transition-colors duration-200 bg-primary/90 hover:bg-primary text-white min-h-[44px] min-w-[44px]"
      )}>
        Save Changes
      </button>
    </div>
  );
};

export default TaskActionButtons;
