
import { useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { useToast } from '@/components/ui/use-toast';
import { Project } from '@/store/projectStore';

export const useProjectsWithStore = (user: any) => {
  const { toast } = useToast();
  const userId = user?.id;
  
  const {
    projects,
    isLoadingProjects,
    activeProjectId,
    setActiveProjectId,
    fetchProjects,
    createProject: storeCreateProject,
    deleteProject: storeDeleteProject
  } = useProjectStore();

  useEffect(() => {
    fetchProjects(userId);
  }, [fetchProjects, userId]);

  // Wrap store functions to add toast notifications
  const createProject = async (projectData: { name: string; color: string }) => {
    const newProject = await storeCreateProject(projectData, userId);
    
    toast({
      title: user ? "Project created" : "Project created (Demo Mode)",
      description: user ? "Your project has been added successfully." : "Sign in to save your projects permanently.",
    });
    
    return newProject;
  };

  const deleteProject = async (projectId: string) => {
    await storeDeleteProject(projectId, userId);
    
    toast({
      title: "Project deleted",
      description: "The project has been deleted successfully.",
    });
  };

  return {
    projects,
    isLoadingProjects,
    activeProjectId,
    setActiveProjectId,
    createProject,
    deleteProject
  };
};
