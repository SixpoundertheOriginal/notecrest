
import React from 'react';
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

export default TaskContent;
