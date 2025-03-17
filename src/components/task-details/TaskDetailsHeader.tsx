
import React from 'react';
import { cn } from '@/lib/utils';

interface TaskDetailsHeaderProps {
  darkMode: boolean;
}

const TaskDetailsHeader = ({ darkMode }: TaskDetailsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display font-medium text-base">Task Details</h3>
      <div className="flex space-x-1">
        <button
          className={cn(
            "p-1 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center",
            darkMode
              ? 'hover:bg-gray-800 text-gray-300 hover:text-gray-100'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        </button>
        <button
          className={cn(
            "p-1 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center",
            darkMode
              ? 'hover:bg-gray-800 text-gray-300 hover:text-gray-100'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default TaskDetailsHeader;
