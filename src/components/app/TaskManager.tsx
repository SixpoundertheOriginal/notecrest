
import React, { useState } from 'react';
import TaskAppTabs from '@/components/TaskAppTabs';
import TaskContent from './TaskContent';

interface TaskManagerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  tasks: any[];
  isLoadingTasks: boolean;
  draggedTaskId: number | string | null;
  isLoggedIn: boolean;
  onDragStart: (e: React.DragEvent, id: number | string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: number | string) => void;
  onToggleCompletion: (id: number | string) => void;
  onToggleExpansion: (id: number | string) => void;
  onAddTask: (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => void;
  onClearCompletedTasks: () => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  tasks,
  isLoadingTasks,
  draggedTaskId,
  isLoggedIn,
  onDragStart,
  onDragOver,
  onDrop,
  onToggleCompletion,
  onToggleExpansion,
  onAddTask,
  onClearCompletedTasks
}) => {
  return (
    <>
      <TaskAppTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        darkMode={darkMode} 
      />
      
      <TaskContent
        activeTab={activeTab}
        darkMode={darkMode}
        tasks={tasks}
        isLoadingTasks={isLoadingTasks}
        draggedTaskId={draggedTaskId}
        isLoggedIn={isLoggedIn}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onToggleCompletion={onToggleCompletion}
        onToggleExpansion={onToggleExpansion}
        onAddTask={onAddTask}
        onClearCompletedTasks={onClearCompletedTasks}
      />
    </>
  );
};

export default TaskManager;
