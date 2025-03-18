
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import TasksView from '@/components/TasksView';
import CompletedTasksView from '@/components/CompletedTasksView';
import NotesView from '@/components/NotesView';
import TaskAppTabs from '@/components/TaskAppTabs';

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
  const [sortOption, setSortOption] = useState<string>("date-desc");

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
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
    </>
  );
};

interface TaskContentProps extends Omit<TaskManagerProps, 'activeTab' | 'setActiveTab'> {
  activeTab: string;
  sortOption: string;
  onSortChange: (value: string) => void;
}

const TaskContent: React.FC<TaskContentProps> = ({
  activeTab,
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
  onClearCompletedTasks,
  sortOption,
  onSortChange
}) => {
  if (activeTab === 'tasks') {
    return (
      <TasksView 
        darkMode={darkMode}
        tasks={tasks.filter(task => !task.completed)}
        isLoading={isLoadingTasks}
        draggedTaskId={draggedTaskId}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onToggleCompletion={onToggleCompletion}
        onToggleExpansion={onToggleExpansion}
        onAddTask={onAddTask}
        isLoggedIn={isLoggedIn}
        sortOption={sortOption}
        onSortChange={onSortChange}
      />
    );
  }
  
  if (activeTab === 'completed') {
    return (
      <CompletedTasksView 
        darkMode={darkMode}
        tasks={tasks}
        isLoading={isLoadingTasks}
        draggedTaskId={draggedTaskId}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onToggleCompletion={onToggleCompletion}
        onToggleExpansion={onToggleExpansion}
        onClearCompletedTasks={onClearCompletedTasks}
      />
    );
  }
  
  // Default to notes view
  return <NotesView darkMode={darkMode} />;
};

export default TaskManager;
