
import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskData } from '@/types/task';

interface TaskMetaFieldsProps {
  task: TaskData;
  darkMode: boolean;
  onPriorityChange: (value: string) => void;
  onDueDateChange: (value: string) => void;
}

const TaskMetaFields = ({ 
  task, 
  darkMode, 
  onPriorityChange,
  onDueDateChange
}: TaskMetaFieldsProps) => {
  // Function to get priority-specific styling for the select element
  const getPriorityStyle = () => {
    switch (task.priority) {
      case 'High': return 'focus:border-rose-500 text-rose-500';
      case 'Medium': return 'focus:border-amber-500 text-amber-500';
      case 'Low': return 'focus:border-blue-500 text-blue-500';
      default: return '';
    }
  };

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
            onChange={(e) => onDueDateChange(e.target.value)}
            className="bg-transparent focus:outline-none w-full"
          />
        </div>
      </div>
      
      <div>
        <label className={cn("block text-xs mb-1", darkMode ? 'text-gray-300' : 'text-gray-600')}>
          Priority
        </label>
        <select
          value={task.priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className={cn(
            "w-full px-3 py-2 rounded-lg text-sm appearance-none transition-all duration-200 min-h-[44px]",
            darkMode 
              ? 'bg-gray-800/50 border border-gray-700 text-white' 
              : 'bg-white border border-gray-300',
            getPriorityStyle()
          )}
        >
          <option value="High" className="text-rose-500">High</option>
          <option value="Medium" className="text-amber-500">Medium</option>
          <option value="Low" className="text-blue-500">Low</option>
        </select>
      </div>
    </div>
  );
};

export default TaskMetaFields;
