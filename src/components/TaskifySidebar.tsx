
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import SidebarContents from './sidebar/SidebarContents';
import ProjectDialog from './sidebar/ProjectDialog';
import SearchDialog from './sidebar/SearchDialog';
import { Button } from './ui/button';
import { Search, Plus, FolderPlus } from 'lucide-react';
import { Sidebar } from './ui/sidebar';
import CalendarNavItem from './calendar/CalendarNavItem';
import Logo from './Logo';

interface TaskifySidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  projects: any[];
  isLoadingProjects: boolean;
  activeProjectId: string | null;
  setActiveProjectId: (projectId: string | null) => void;
  createProject: (name: string, color: string) => Promise<void>;
  onAddTask: (task: any) => void;
}

const TaskifySidebar = ({ 
  activeTab, 
  setActiveTab,
  projects,
  isLoadingProjects,
  activeProjectId,
  setActiveProjectId,
  createProject,
  onAddTask
}: TaskifySidebarProps) => {
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', color: '#7dd3fc' });

  const addProject = async () => {
    if (newProject.name.trim() !== '') {
      await createProject(newProject.name, newProject.color);
      setNewProject({ name: '', color: '#7dd3fc' });
      setIsProjectDialogOpen(false);
    }
  };

  // Create a wrapper function to adapt the interface
  const handleCreateProject = async (projectData: { name: string, color: string }) => {
    await createProject(projectData.name, projectData.color);
  };

  return (
    <>
      <Sidebar>
        <div className="h-full flex flex-col">
          <div className="flex-none p-4">
            <Logo />
          </div>
          <div className="flex-1 overflow-y-auto">
            {/* We'll pass username and navItems to make SidebarContents happy */}
            <SidebarContents
              username="User"
              navItems={[
                {
                  icon: Search,
                  label: "Search",
                  action: () => setIsSearchDialogOpen(true)
                }
              ]}
              projects={projects}
              isLoadingProjects={isLoadingProjects}
              activeProjectId={activeProjectId || null}
              handleProjectClick={(id) => setActiveProjectId(id)}
              createProject={handleCreateProject}
              isTaskSheetOpen={false}
              setIsTaskSheetOpen={() => {}}
              onAddTask={onAddTask}
            />
            
            {/* Calendar integration navigation */}
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2">
                Integrations
              </h3>
              <div className="space-y-1">
                <CalendarNavItem />
              </div>
            </div>
          </div>
          
          <div className="flex-none p-4 space-y-2">
            <Button variant="secondary" size="sm" className="w-full justify-start" onClick={() => setIsSearchDialogOpen(true)}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
            <Button variant="secondary" size="sm" className="w-full justify-start" onClick={() => setIsProjectDialogOpen(true)}>
              <FolderPlus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
      </Sidebar>
      
      <ProjectDialog
        onCreateProject={handleCreateProject}
      />
      <SearchDialog />
    </>
  );
};

export default TaskifySidebar;
