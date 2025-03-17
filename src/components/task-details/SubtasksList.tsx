
import React from 'react';
import { cn } from '@/lib/utils';
import SubtaskItem from './SubtaskItem';
import { SubTask } from '@/types/task';

interface SubtasksListProps {
  subtasks: SubTask[];
  toggleSubtaskCompletion: (id: string) => void;
  deleteSubtask: (id: string) => void;
  darkMode: boolean;
}

const SubtasksList = ({ 
  subtasks, 
  toggleSubtaskCompletion, 
  deleteSubtask, 
  darkMode 
}: SubtasksListProps) => {
  if (subtasks.length === 0) return null;

  return (
    <div className={cn(
      "p-2 rounded-lg mb-2",
      darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'
    )}>
      {subtasks.map(subtask => (
        <SubtaskItem
          key={subtask.id}
          id={subtask.id}
          title={subtask.title}
          completed={subtask.completed}
          toggleCompletion={toggleSubtaskCompletion}
          deleteSubtask={deleteSubtask}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
};

export default SubtasksList;
