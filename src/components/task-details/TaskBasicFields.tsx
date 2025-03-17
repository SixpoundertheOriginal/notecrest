
import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskData } from '@/types/task';
import { getStatusIcon } from '@/lib/taskUtils';

interface TaskBasicFieldsProps {
  task: TaskData;
  darkMode: boolean;
}

const TaskBasicFields = ({ task, darkMode }: TaskBasicFieldsProps) => {
  return (
    <div className="space-y-3">
      <div>
        <label className={cn("block text-xs mb-1", darkMode ? 'text-gray-300' : 'text-gray-600')}>
          Title
        </label>
        <input 
          type="text" 
          defaultValue={task.title}
          className={cn(
            "w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 min-h-[44px]",
            darkMode 
              ? 'bg-gray-800/70 border border-gray-700 focus:border-primary text-white' 
              : 'bg-white border border-gray-300 focus:border-primary text-gray-800'
          )}
        />
      </div>
      
      <div>
        <label className={cn("block text-xs mb-1", darkMode ? 'text-gray-300' : 'text-gray-600')}>
          Description
        </label>
        <textarea
          rows={2}
          placeholder="Add a description..."
          className={cn(
            "w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 min-h-[44px]",
            darkMode 
              ? 'bg-gray-800/70 border border-gray-700 focus:border-primary text-white placeholder-gray-500' 
              : 'bg-white border border-gray-300 focus:border-primary text-gray-800 placeholder-gray-500'
          )}
        />
      </div>
    </div>
  );
};

export default TaskBasicFields;
