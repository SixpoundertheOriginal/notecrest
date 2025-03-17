
import React from 'react';
import { Project } from '@/hooks/useProjects';
import { User, Hash, Search } from 'lucide-react';
import { 
  SidebarHeader, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarSeparator, 
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar";
import SidebarNavItem from './SidebarNavItem';
import ProjectDialog from './ProjectDialog';
import SearchDialog from './SearchDialog';
import TaskCreationSheet from '../TaskCreationSheet';

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
  const favoritedProjects = projects.filter(project => 
    project.name.toLowerCase() === 'projects' || 
    project.name.toLowerCase() === 'main'
  );

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
      <SidebarHeader className="px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User size={16} className="text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{username}</span>
            <span className="text-xs text-muted-foreground">Free Plan</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Main navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item, index) => (
                <SidebarMenuItem key={item.label}>
                  {item.component ? (
                    <SidebarMenuButton className="px-2 py-2">
                      {item.component}
                    </SidebarMenuButton>
                  ) : (
                    <SidebarNavItem 
                      {...item} 
                    />
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        {/* Favorites section */}
        <SidebarGroup>
          <SidebarGroupLabel>Favorites</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {favoritedProjects.map(project => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton 
                    isActive={activeProjectId === project.id}
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <Hash size={18} className={
                      project.color === "blue" ? "text-blue-400" : 
                      project.color === "pink" ? "text-pink-400" : 
                      project.color === "green" ? "text-green-400" : 
                      project.color === "purple" ? "text-purple-400" : 
                      "text-orange-400"
                    } />
                    <span>{project.name}</span>
                    <span className="ml-auto text-xs opacity-60">{project.task_count}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        {/* My Projects section */}
        <SidebarGroup>
          <div className="flex items-center justify-between px-4 py-2">
            <SidebarGroupLabel>My Projects</SidebarGroupLabel>
            <ProjectDialog onCreateProject={createProject} />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects
                .filter(project => 
                  project.name.toLowerCase() !== 'projects' && 
                  project.name.toLowerCase() !== 'main'
                )
                .map(project => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton 
                    isActive={activeProjectId === project.id}
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <Hash size={18} className={
                      project.color === "blue" ? "text-blue-400" : 
                      project.color === "pink" ? "text-pink-400" : 
                      project.color === "green" ? "text-green-400" : 
                      project.color === "purple" ? "text-purple-400" : 
                      "text-orange-400"
                    } />
                    <span>{project.name}</span>
                    <span className="ml-auto text-xs opacity-60">{project.task_count}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {projects.length === 0 && !isLoadingProjects && (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  No projects yet. Create one to get started.
                </div>
              )}
              {isLoadingProjects && (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  Loading projects...
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-white/5">
        <div className="p-2">
          <SearchDialog />
        </div>
      </SidebarFooter>
      
      {/* Task Creation Sheet - Now we're using the props properly */}
      <TaskCreationSheet 
        isOpen={isTaskSheetOpen}
        onClose={setIsTaskSheetOpen}
        onSubmit={handleTaskSubmit}
      />
    </>
  );
};

export default SidebarContents;
