
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import SidebarContents from './sidebar/SidebarContents';
import ProjectDialog from './sidebar/ProjectDialog';
import { Button } from './ui/button';
import { FolderPlus } from 'lucide-react';
import { Sidebar } from './ui/sidebar';
import CalendarNavItem from './calendar/CalendarNavItem';
import Logo from './Logo';
import { useProjects } from '@/contexts/ProjectContext';

interface TaskifySidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddTask: (task: any) => void;
}

const TaskifySidebar = ({ 
  activeTab, 
  setActiveTab,
  onAddTask
}: TaskifySidebarProps) => {
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
  const { 
    projects, 
    isLoadingProjects, 
    activeProjectId, 
    setActiveProjectId, 
    createProject 
  } = useProjects();

  // Define navigation items for the sidebar
  const navItems = [
    // Add navigation items as needed - empty array for now as it's a required prop
  ];

  return (
    <>
      <Sidebar>
        <div className="h-full flex flex-col">
          <div className="flex-none p-4">
            <Logo />
          </div>
          <div className="flex-1 overflow-y-auto">
            <SidebarContents
              username="User" // Provide a default username
              navItems={navItems} 
              projects={projects}
              isLoadingProjects={isLoadingProjects}
              activeProjectId={activeProjectId || null}
              handleProjectClick={(id) => setActiveProjectId(id)}
              createProject={createProject}
              isTaskSheetOpen={isTaskSheetOpen}
              setIsTaskSheetOpen={setIsTaskSheetOpen}
              onAddTask={onAddTask}
            />
          </div>
          
          <div className="flex-none p-4">
            <Button variant="secondary" size="sm" className="w-full justify-start" onClick={() => setIsTaskSheetOpen(true)}>
              <FolderPlus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
      </Sidebar>
      
      <ProjectDialog
        onCreateProject={createProject}
      />
    </>
  );
};

export default TaskifySidebar;
