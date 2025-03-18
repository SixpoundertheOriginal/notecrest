
import React from 'react';
import { Project } from '@/hooks/useProjects';
import { SidebarContent, SidebarSeparator } from "@/components/ui/sidebar";
import TaskCreationSheet from '../TaskCreationSheet';
import SidebarUserHeader from './SidebarUserHeader';
import SidebarMainNavigation from './SidebarMainNavigation';
import FavoritesSection from './FavoritesSection';
import ProjectsSection from './ProjectsSection';
import SidebarFooterSearch from './SidebarFooterSearch';

interface SidebarContentsProps {
  username: string;
  navItems: Array<{
    icon: React.ElementType;
    label: string;
    action?: () => void;
    isActive?: boolean;
    highlight?: boolean;
    component?: React.ReactNode;
  }>;
  projects: Project[];
  isLoadingProjects: boolean;
  activeProjectId: string | null;
  handleProjectClick: (id: string) => void;
  createProject: (data: { name: string, color: string }) => void;
  isTaskSheetOpen: boolean;
  setIsTaskSheetOpen: (isOpen: boolean) => void;
  onAddTask: (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => void;
}

const SidebarContents = ({
  username,
  navItems,
  projects,
  isLoadingProjects,
  activeProjectId,
  handleProjectClick,
  createProject,
  isTaskSheetOpen,
  setIsTaskSheetOpen,
  onAddTask
}: SidebarContentsProps) => {
  const handleTaskSubmit = (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => {
    console.log('SidebarContents: Task submitted', task);
    onAddTask(task);
  };

  return (
    <>
      <SidebarUserHeader username={username} />
      
      <SidebarContent>
        {/* Main navigation */}
        <SidebarMainNavigation navItems={navItems} />
        
        <SidebarSeparator />
        
        {/* Favorites section */}
        <FavoritesSection 
          projects={projects}
          activeProjectId={activeProjectId}
          handleProjectClick={handleProjectClick}
        />
        
        <SidebarSeparator />
        
        {/* My Projects section */}
        <ProjectsSection 
          projects={projects}
          isLoadingProjects={isLoadingProjects}
          activeProjectId={activeProjectId}
          handleProjectClick={handleProjectClick}
          createProject={createProject}
        />
      </SidebarContent>
      
      <SidebarFooterSearch />
      
      {/* Task Creation Sheet */}
      <TaskCreationSheet 
        isOpen={isTaskSheetOpen}
        onClose={setIsTaskSheetOpen}
        onSubmit={handleTaskSubmit}
      />
    </>
  );
};

export default SidebarContents;
