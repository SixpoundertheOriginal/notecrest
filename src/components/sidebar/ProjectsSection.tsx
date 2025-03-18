
import React from 'react';
import { Project } from '@/hooks/useProjects';
import { Hash } from 'lucide-react';
import { 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import ProjectDialog from './ProjectDialog';

interface ProjectsSectionProps {
  projects: Project[];
  isLoadingProjects: boolean;
  activeProjectId: string | null;
  handleProjectClick: (id: string) => void;
  createProject: (data: { name: string, color: string }) => void;
}

const ProjectsSection = ({
  projects,
  isLoadingProjects,
  activeProjectId,
  handleProjectClick,
  createProject
}: ProjectsSectionProps) => {
  const nonFavoriteProjects = projects.filter(project => 
    project.name.toLowerCase() !== 'projects' && 
    project.name.toLowerCase() !== 'main'
  );

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between px-4 py-2">
        <SidebarGroupLabel>My Projects</SidebarGroupLabel>
        <ProjectDialog onCreateProject={createProject} />
      </div>
      <SidebarGroupContent>
        <SidebarMenu>
          {nonFavoriteProjects.map(project => (
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
  );
};

export default ProjectsSection;
