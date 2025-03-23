
import React from 'react';
import { cn } from '@/lib/utils';
import { TaskData } from '@/types/task';
import { getStatusIcon } from '@/lib/taskUtils';

interface TaskStatusFieldProps {
  task: TaskData;
  darkMode: boolean;
  onStatusChange: (value: string) => void;
}

const TaskStatusField = ({ task, darkMode, onStatusChange }: TaskStatusFieldProps) => {
  return (
    <div>
      <label className={cn("block text-xs mb-1", darkMode ? 'text-gray-300' : 'text-gray-600')}>
        Status
      </label>
      <div className="flex space-x-4 mb-2">
        {['Todo', 'In Progress', 'Completed'].map((status) => (
          <div key={status} className="flex items-center">
            {getStatusIcon(status)}
            <span className="text-xs">{status}</span>
          </div>
        ))}
      </div>
      <select
        value={task.status}
        onChange={(e) => onStatusChange(e.target.value)}
        className={cn(
          "w-full px-3 py-2 rounded-lg text-sm appearance-none transition-all duration-200 min-h-[44px]",
          darkMode 
            ? 'bg-gray-800/50 border border-gray-700 focus:border-primary text-white' 
            : 'bg-white border border-gray-300 focus:border-primary'
        )}
      >
        <option value="Todo">To-Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
    </div>
  );
};

export default TaskStatusField;
