
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import TaskAppHeader from './TaskAppHeader';
import { useAuth } from '@/hooks/useAuth';
import WelcomeHeader from './app/WelcomeHeader';
import TaskContent from './app/TaskContent';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import TaskifySidebar from './TaskifySidebar';
import { SidebarInset } from './ui/sidebar';
import AuthModal from './auth/AuthModal';
import FloatingActionButton from './FloatingActionButton';
import TaskCreationSheet from './TaskCreationSheet';

const TaskifyApp = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [darkMode, setDarkMode] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
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

  const {
    projects,
    isLoadingProjects,
    activeProjectId,
    setActiveProjectId,
    createProject,
    deleteProject
  } = useProjects(user);

  const toggleTheme = () => setDarkMode(!darkMode);
  
  const username = user?.email ? user.email.split('@')[0] : undefined;
  const isLoggedIn = !!user;

  // Map activeTab to a more user-friendly title
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

  // Filter tasks based on active project
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
      <TaskifySidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        projects={projects}
        isLoadingProjects={isLoadingProjects}
        activeProjectId={activeProjectId}
        setActiveProjectId={setActiveProjectId}
        createProject={createProject}
        onAddTask={addTask}
      />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <div className="pt-10 md:pt-0">
            <TaskAppHeader 
              darkMode={darkMode} 
              toggleTheme={toggleTheme} 
              pageTitle={getPageTitle()}
              isLoggedIn={isLoggedIn}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              onAddTask={addTask}
              showLoginButton={false}
            />
          </div>

          <div className="flex-grow p-4 md:p-6">
            <div className="max-w-5xl mx-auto">
              <WelcomeHeader 
                username={username} 
                isLoggedIn={isLoggedIn} 
                onOpenAuth={() => setIsAuthModalOpen(true)}
              />
              <TaskContent
                activeTab={activeTab}
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
          
          {/* Floating Action Button */}
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
