
import React, { useState } from 'react';
import TasksView from '@/components/TasksView';
import CompletedTasksView from '@/components/CompletedTasksView';
import NotesView from '@/components/NotesView';
import { sortTasks, filterTasksByCompletion } from '@/lib/taskFilters';

interface TaskContentProps {
  activeTab: string;
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

const TaskContent = ({
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
  onClearCompletedTasks
}: TaskContentProps) => {
  const [sortOption, setSortOption] = useState<string>("date-desc");

  // Use the utility function to get sorted tasks
  const sortedTasks = sortTasks(tasks, sortOption);

  if (activeTab === 'tasks') {
    // Use utility function to filter active tasks
    const activeTasks = filterTasksByCompletion(sortedTasks, false);
    
    return (
      <TasksView 
        darkMode={darkMode}
        tasks={activeTasks}
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
        onSortChange={setSortOption}
      />
    );
  }
  
  if (activeTab === 'completed') {
    // Use utility function to filter completed tasks
    const completedTasks = filterTasksByCompletion(sortedTasks, true);
    
    return (
      <CompletedTasksView 
        darkMode={darkMode}
        tasks={completedTasks}
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

export default TaskContent;
