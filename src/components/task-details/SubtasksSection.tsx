
import React from 'react';
import { cn } from '@/lib/utils';
import SubtasksList from './SubtasksList';
import SubtaskInput from './SubtaskInput';
import { SubTask } from '@/types/task';

interface SubtasksSectionProps {
  subtasks: SubTask[];
  toggleSubtaskCompletion: (id: string) => void;
  deleteSubtask: (id: string) => void;
  onAddSubtask: (title: string) => void;
  darkMode: boolean;
}

const SubtasksSection = ({ 
  subtasks, 
  toggleSubtaskCompletion, 
  deleteSubtask, 
  onAddSubtask, 
  darkMode 
}: SubtasksSectionProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className={cn("block text-xs", darkMode ? 'text-gray-300' : 'text-gray-600')}>
          Subtasks
        </label>
        <button 
          onClick={() => {}}
          className={cn(
            darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600',
            "min-h-[44px] min-w-[44px] flex items-center justify-center"
          )}
        >
          + Add
        </button>
      </div>

      <SubtasksList
        subtasks={subtasks}
        toggleSubtaskCompletion={toggleSubtaskCompletion}
        deleteSubtask={deleteSubtask}
        darkMode={darkMode}
      />
      
      <SubtaskInput 
        onAddSubtask={onAddSubtask}
        darkMode={darkMode}
      />
    </div>
  );
};

export default SubtasksSection;
