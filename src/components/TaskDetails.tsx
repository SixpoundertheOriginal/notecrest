
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TaskData, SubTask } from '@/types/task';
import TaskDetailsHeader from './task-details/TaskDetailsHeader';
import TaskBasicFields from './task-details/TaskBasicFields';
import TaskMetaFields from './task-details/TaskMetaFields';
import TaskStatusField from './task-details/TaskStatusField';
import SubtasksSection from './task-details/SubtasksSection';
import TaskActionButtons from './task-details/TaskActionButtons';

interface TaskDetailsProps {
  task: TaskData;
  darkMode: boolean;
}

const TaskDetails = ({ task, darkMode }: TaskDetailsProps) => {
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);

  const handleAddSubtask = (title: string) => {
    const newSubtask: SubTask = {
      id: `subtask-${Date.now()}`,
      title: title,
      completed: false
    };
    
    setSubtasks([...subtasks, newSubtask]);
  };

  const toggleSubtaskCompletion = (id: string) => {
    setSubtasks(subtasks.map(subtask => 
      subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
    ));
  };

  const deleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
  };

  return (
    <div 
      className={cn(
        "mt-4 p-4 rounded-xl text-sm transition-all duration-300 origin-top animate-expand overflow-hidden",
        darkMode 
          ? 'bg-gray-900/80 border border-gray-800/70' 
          : 'bg-white/90 border border-gray-200/80'
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <TaskDetailsHeader darkMode={darkMode} />
      
      {/* Form fields */}
      <div className="space-y-4">
        <TaskBasicFields task={task} darkMode={darkMode} />
        <TaskMetaFields task={task} darkMode={darkMode} />
        <TaskStatusField task={task} darkMode={darkMode} />
        
        <SubtasksSection
          subtasks={subtasks}
          toggleSubtaskCompletion={toggleSubtaskCompletion}
          deleteSubtask={deleteSubtask}
          onAddSubtask={handleAddSubtask}
          darkMode={darkMode}
        />

        <TaskActionButtons darkMode={darkMode} />
      </div>
    </div>
  );
};

export default TaskDetails;
