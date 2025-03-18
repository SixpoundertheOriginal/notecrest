
import React from 'react';
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
  const subtasks = task.subtasks || [];

  const handleAddSubtask = (title: string) => {
    const newSubtask: SubTask = {
      id: `subtask-${Date.now()}`,
      title: title,
      completed: false
    };
    
    if (!task.subtasks) {
      task.subtasks = [newSubtask];
    } else {
      task.subtasks.push(newSubtask);
    }
  };

  const toggleSubtaskCompletion = (id: string) => {
    if (!task.subtasks) return;
    
    const updatedSubtasks = task.subtasks.map(subtask => 
      subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
    );
    
    task.subtasks = updatedSubtasks;
  };

  const deleteSubtask = (id: string) => {
    if (!task.subtasks) return;
    task.subtasks = task.subtasks.filter(subtask => subtask.id !== id);
  };

  // Determine the color based on priority
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'High': return 'from-red-500/20 to-transparent';
      case 'Medium': return 'from-yellow-500/20 to-transparent';
      default: return 'from-blue-500/20 to-transparent';
    }
  };

  return (
    <div 
      className={cn(
        "mt-4 p-4 rounded-xl text-sm transition-all duration-300 origin-top animate-expand overflow-hidden relative",
        darkMode 
          ? 'bg-gray-900/40 backdrop-blur-md border border-gray-800/70' 
          : 'bg-white/40 backdrop-blur-md border border-gray-200/50'
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Cosmic decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient corner glow */}
        <div className={`absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-tl ${getPriorityColor()} opacity-40 blur-xl`}></div>
        
        {/* Subtle cosmic stars */}
        <div className="absolute top-1/4 right-1/4 w-0.5 h-0.5 bg-white/70 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/5 w-0.5 h-0.5 bg-white/60 rounded-full"></div>
        <div className="absolute top-2/3 right-1/3 w-0.5 h-0.5 bg-white/50 rounded-full"></div>
      </div>
      
      <div className="relative z-10">
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
    </div>
  );
};

export default TaskDetails;
