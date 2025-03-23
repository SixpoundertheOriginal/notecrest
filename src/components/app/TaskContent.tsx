
import React, { useState, useEffect, useMemo } from 'react';
import TasksView from '@/components/TasksView';
import CompletedTasksView from '@/components/CompletedTasksView';
import NotesView from '@/components/NotesView';

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

  // Memoize sorted tasks to prevent recalculation on every render
  const sortedTasks = useMemo(() => {
    if (!tasks) return [];
    console.log('Computing sorted tasks');
    
    // Create a copy to avoid mutating the original array
    const tasksCopy = [...tasks];
    
    switch (sortOption) {
      case 'date-asc':
        return tasksCopy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'priority-desc':
        return tasksCopy.sort((a, b) => {
          const priorityValue = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return (priorityValue[b.priority] || 0) - (priorityValue[a.priority] || 0);
        });
      case 'title-asc':
        return tasksCopy.sort((a, b) => a.title.localeCompare(b.title));
      case 'date-desc':
      default:
        return tasksCopy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [tasks, sortOption]);

  // Memoize filtered incomplete tasks to prevent recalculation on every render
  const incompleteTasks = useMemo(() => {
    console.log('Computing incomplete tasks');
    return sortedTasks.filter(task => !task.completed);
  }, [sortedTasks]);

  // Memoize the rendered view based on activeTab
  const renderedView = useMemo(() => {
    console.log('Computing rendered view for tab:', activeTab);
    
    if (activeTab === 'tasks') {
      return (
        <TasksView 
          darkMode={darkMode}
          tasks={incompleteTasks}
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
  }, [
    activeTab, 
    darkMode, 
    incompleteTasks, 
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
    sortOption
  ]);

  return renderedView;
};

export default React.memo(TaskContent);
