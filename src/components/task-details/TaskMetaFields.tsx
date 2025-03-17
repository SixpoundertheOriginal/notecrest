
import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskData } from '@/types/task';
import { getStatusIcon } from '@/lib/taskUtils';

interface TaskMetaFieldsProps {
  task: TaskData;
  darkMode: boolean;
}

const TaskMetaFields = ({ task, darkMode }: TaskMetaFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={cn("block text-xs mb-1", darkMode ? 'text-gray-300' : 'text-gray-600')}>
          Due Date
        </label>
        <div className={cn(
          "flex items-center px-3 py-2 rounded-lg text-sm min-h-[44px]",
          darkMode 
            ? 'bg-gray-800/50 border border-gray-700 focus-within:border-primary' 
            : 'bg-white border border-gray-300 focus-within:border-primary'
        )}>
          <Calendar size={14} className="mr-2 text-gray-500" />
          <input 
            type="date" 
            defaultValue="2025-03-08"
            className="bg-transparent focus:outline-none w-full"
          />
        </div>
      </div>
      
      <div>
        <label className={cn("block text-xs mb-1", darkMode ? 'text-gray-300' : 'text-gray-600')}>
          Priority
        </label>
        <select
          defaultValue={task.priority}
          className={cn(
            "w-full px-3 py-2 rounded-lg text-sm appearance-none transition-all duration-200 min-h-[44px]",
            darkMode 
              ? 'bg-gray-800/50 border border-gray-700 focus:border-primary text-white' 
              : 'bg-white border border-gray-300 focus:border-primary'
          )}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
    </div>
  );
};

export default TaskMetaFields;
