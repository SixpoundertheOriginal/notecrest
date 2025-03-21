
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import TaskAppHeader from './TaskAppHeader';
import { useAuth } from '@/hooks/useAuth';
import WelcomeHeader from './app/WelcomeHeader';
import { useTasks } from '@/contexts/TasksContext';
import { useProjects } from '@/contexts/ProjectContext';
import TaskifySidebar from './TaskifySidebar';
import { SidebarInset, SidebarProvider, SidebarRail } from './ui/sidebar';
import AuthModal from './auth/AuthModal';
import TaskCreationSheet from './TaskCreationSheet';
import { useIsMobile } from '@/hooks/use-mobile';
import TaskManager from './app/TaskManager';
import { useTheme } from '@/contexts/ThemeContext';
import { filterTasksByProject } from '@/lib/taskFilters';

const TaskifyApp = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { isMobile } = useIsMobile();
  const { darkMode, toggleTheme } = useTheme();
  const { projects, activeProjectId } = useProjects();
  
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
  } = useTasks();
  
  const username = user?.email ? user.email.split('@')[0] : undefined;
  const isLoggedIn = !!user;

  const getPageTitle = () => {
    if (activeProjectId) {
      const project = projects.find(p => p.id === activeProjectId);
      return project ? project.name : 'Project';
    }

    switch(activeTab) {
      case 'tasks': return 'Today';
      case 'completed': return 'Completed';
      case 'notes': return 'Upcoming';
      default: return 'Taskify';
    }
  };

  const filteredTasks = filterTasksByProject(tasks, activeProjectId);
  
  const handleTaskSubmit = (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => {
    console.log('Task submitted from sheet', task);
    addTask({
      ...task,
      projectId: activeProjectId || undefined
    });
    setIsTaskSheetOpen(false);
  };
  
  const handleSheetOpenChange = (open: boolean) => {
    console.log('Sheet state changing to:', open);
    setIsTaskSheetOpen(open);
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      {!isMobile && (
        <TaskifySidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onAddTask={addTask}
        />
      )}
      <SidebarRail />
      <SidebarInset className={cn(isMobile ? "w-full" : "")}>
        <div className="flex flex-col min-h-screen">
          <div className={cn("pt-10 md:pt-0", isMobile ? "pl-0" : "")}>
            <TaskAppHeader 
              darkMode={darkMode} 
              toggleTheme={toggleTheme} 
              pageTitle={getPageTitle()}
              isLoggedIn={isLoggedIn}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onAddTask={addTask}
              showLoginButton={false}
              showSidebarTrigger={isMobile}
            />
          </div>

          <div className="flex-grow p-4 md:p-6">
            <div className="max-w-5xl mx-auto">
              <WelcomeHeader 
                username={username} 
                isLoggedIn={isLoggedIn} 
                onOpenAuth={() => setIsAuthModalOpen(true)}
                tasks={tasks}
              />
              <TaskManager
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                darkMode={darkMode}
                tasks={filteredTasks}
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
        </div>
      </SidebarInset>
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      
      <TaskCreationSheet 
        isOpen={isTaskSheetOpen}
        onClose={handleSheetOpenChange}
        onSubmit={handleTaskSubmit}
      />
    </SidebarProvider>
  );
};

export default TaskifyApp;
