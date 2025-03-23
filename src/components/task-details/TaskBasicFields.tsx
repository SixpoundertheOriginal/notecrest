
import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskData } from '@/types/task';
import { getStatusIcon } from '@/lib/taskUtils';

interface TaskBasicFieldsProps {
  task: TaskData;
  darkMode: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  validationErrors?: {[key: string]: string};
}

const TaskBasicFields = ({ 
  task, 
  darkMode, 
  onTitleChange, 
  onDescriptionChange,
  validationErrors = {}
}: TaskBasicFieldsProps) => {
  return (
    <div className="space-y-3">
      <div>
        <label className={cn("block text-xs mb-1", darkMode ? 'text-gray-300' : 'text-gray-600')}>
          Title
        </label>
        <input 
          type="text" 
          value={task.title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={cn(
            "w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 min-h-[44px]",
            darkMode 
              ? 'bg-gray-800/70 border border-gray-700 focus:border-primary text-white' 
              : 'bg-white border border-gray-300 focus:border-primary text-gray-800',
            validationErrors.title && "border-red-500 focus:border-red-500"
          )}
        />
        {validationErrors.title && (
          <p className="text-red-500 text-xs mt-1">{validationErrors.title}</p>
        )}
      </div>
      
      <div>
        <label className={cn("block text-xs mb-1", darkMode ? 'text-gray-300' : 'text-gray-600')}>
          Description
        </label>
        <textarea
          rows={2}
          value={task.description || ''}
          onChange={(e) => onDescriptionChange(e.target.value)}
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
