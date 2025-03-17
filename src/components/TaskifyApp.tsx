
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import TaskAppHeader from './TaskAppHeader';
import { useAuth } from '@/hooks/useAuth';
import WelcomeHeader from './app/WelcomeHeader';
import TaskContent from './app/TaskContent';
import { useTasks } from '@/hooks/useTasks';
import TaskifySidebar from './TaskifySidebar';
import { SidebarInset } from './ui/sidebar';

const TaskifyApp = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [darkMode, setDarkMode] = useState(true);
  const { user, loading: authLoading } = useAuth();
  
  const {
    tasks,
    isLoadingTasks,
    draggedTaskId,
    toggleTaskCompletion,
    toggleTaskExpansion,
    addTask,
    handleDragStart,
    handleDragOver,
    handleDrop,
    clearCompletedTasks
  } = useTasks(user);

  const toggleTheme = () => setDarkMode(!darkMode);
  
  const username = user?.email ? user.email.split('@')[0] : undefined;
  const isLoggedIn = !!user;

  // Map activeTab to a more user-friendly title
  const getPageTitle = () => {
    switch(activeTab) {
      case 'tasks': return 'Today';
      case 'completed': return 'Completed';
      case 'notes': return 'Upcoming';
      default: return 'Taskify';
    }
  };

  return (
    <>
      <TaskifySidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <SidebarInset>
        <TaskAppHeader 
          darkMode={darkMode} 
          toggleTheme={toggleTheme} 
          pageTitle={getPageTitle()}
        />

        <div className="flex-grow p-4 md:p-6">
          <div className="max-w-5xl mx-auto">
            <TaskContent
              activeTab={activeTab}
              darkMode={darkMode}
              tasks={tasks}
              isLoadingTasks={isLoadingTasks}
              draggedTaskId={draggedTaskId}
              isLoggedIn={isLoggedIn}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onToggleCompletion={toggleTaskCompletion}
              onToggleExpansion={toggleTaskExpansion}
              onAddTask={addTask}
              onClearCompletedTasks={clearCompletedTasks}
            />
          </div>
        </div>
      </SidebarInset>
    </>
  );
};

export default TaskifyApp;
