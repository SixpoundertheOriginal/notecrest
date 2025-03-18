
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
import { getProjectColorClasses } from '@/lib/projectColors';

interface FavoritesSectionProps {
  projects: Project[];
  activeProjectId: string | null;
  handleProjectClick: (id: string) => void;
}

const FavoritesSection = ({
  projects,
  activeProjectId,
  handleProjectClick
}: FavoritesSectionProps) => {
  const favoritedProjects = projects.filter(project => 
    project.name.toLowerCase() === 'projects' || 
    project.name.toLowerCase() === 'main'
  );

  return (
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
                <Hash size={18} className={getProjectColorClasses(project.color)} />
                <span>{project.name}</span>
                <span className="ml-auto text-xs opacity-60">{project.task_count}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default FavoritesSection;
