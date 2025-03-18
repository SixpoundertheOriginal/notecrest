import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import TaskAppHeader from './TaskAppHeader';
import { useAuth } from '@/hooks/useAuth';
import WelcomeHeader from './app/WelcomeHeader';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import TaskifySidebar from './TaskifySidebar';
import { SidebarInset } from './ui/sidebar';
import AuthModal from './auth/AuthModal';
import FloatingActionButton from './FloatingActionButton';
import TaskCreationSheet from './TaskCreationSheet';
import { useIsMobile } from '@/hooks/use-mobile';
import TaskManager from './app/TaskManager';
import { useTheme } from '@/contexts/ThemeContext';

const TaskifyApp = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { isMobile } = useIsMobile();
  const { darkMode, toggleTheme } = useTheme();
  
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

  const {
    projects,
    isLoadingProjects,
    activeProjectId,
    setActiveProjectId,
    createProject,
    deleteProject
  } = useProjects(user);

  const handleCreateProject = async (projectData: { name: string, color: string }): Promise<void> => {
    await createProject(projectData);
  };
  
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

  const filteredTasks = activeProjectId
    ? tasks.filter(task => task.project_id === activeProjectId)
    : tasks;
    
  const handleOpenTaskSheet = () => {
    console.log("Opening task creation sheet from FAB");
    setIsTaskSheetOpen(true);
  };
  
  const handleTaskSubmit = (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => {
    console.log('Task submitted from FAB', task);
    addTask(task);
    setIsTaskSheetOpen(false);
  };
  
  const handleSheetOpenChange = (open: boolean) => {
    console.log('Sheet state changing to:', open);
    setIsTaskSheetOpen(open);
  };

  return (
    <>
      {!isMobile && (
        <TaskifySidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          projects={projects}
          isLoadingProjects={isLoadingProjects}
          activeProjectId={activeProjectId}
          setActiveProjectId={setActiveProjectId}
          createProject={handleCreateProject}
          onAddTask={addTask}
        />
      )}
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
          
          <FloatingActionButton onClick={handleOpenTaskSheet} />
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
    </>
  );
};

export default TaskifyApp;
