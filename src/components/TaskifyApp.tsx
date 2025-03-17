
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import TaskAppHeader from './TaskAppHeader';
import TaskAppTabs from './TaskAppTabs';
import { useAuth } from '@/hooks/useAuth';
import AuthSection from './app/AuthSection';
import WelcomeHeader from './app/WelcomeHeader';
import TaskContent from './app/TaskContent';
import { useTasks } from '@/hooks/useTasks';

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

  return (
    <div className="flex flex-col min-h-screen dark">
      <TaskAppHeader 
        darkMode={darkMode} 
        toggleTheme={toggleTheme} 
        rightContent={<AuthSection user={user} />}
      />

      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <WelcomeHeader 
            username={username} 
            isLoggedIn={isLoggedIn} 
          />

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
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onToggleCompletion={toggleTaskCompletion}
            onToggleExpansion={toggleTaskExpansion}
            onAddTask={addTask}
            onClearCompletedTasks={clearCompletedTasks}
          />
        </div>
      </main>
    </div>
  );
};

export default TaskifyApp;
