
import React from 'react';
import { cn } from '@/lib/utils';

interface SubtaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  toggleCompletion: (id: string) => void;
  deleteSubtask: (id: string) => void;
  darkMode: boolean;
}

const SubtaskItem = ({ 
  id, 
  title, 
  completed, 
  toggleCompletion, 
  deleteSubtask,
  darkMode 
}: SubtaskItemProps) => {
  return (
    <div className="flex items-center justify-between mb-2 last:mb-0">
      <div className="flex items-center flex-1">
        <input 
          type="checkbox" 
          checked={completed}
          onChange={() => toggleCompletion(id)}
          className="mr-2 h-4 w-4 rounded border-gray-300"
        />
        <span className={cn(
          "text-xs", 
          completed && "line-through opacity-70"
        )}>
          {title}
        </span>
      </div>
      <button 
        onClick={() => deleteSubtask(id)}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
      </button>
    </div>
  );
};

export default SubtaskItem;
