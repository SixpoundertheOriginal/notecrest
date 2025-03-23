
import { useEffect } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { useToast } from '@/components/ui/use-toast';
import { Project } from '@/store/projectStore';
import { useProjectSelectors, useProjectActions } from './useProjectSelectors';

export const useProjectsWithStore = (user: any) => {
  const { toast } = useToast();
  const userId = user?.id;
  
  // Get project state with selectors
  const { projects, isLoadingProjects, activeProjectId } = useProjectSelectors();
  
  // Get project actions with selectors
  const {
    setActiveProjectId,
    createProject: storeCreateProject,
    deleteProject: storeDeleteProject
  } = useProjectActions();
  
  // Fetch projects is a special case as it's only used in useEffect
  const fetchProjects = useProjectStore(state => state.fetchProjects);

  // Server state initialization
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
    // Server-derived state
    projects,
    isLoadingProjects,
    
    // Client-only state
    activeProjectId,
    setActiveProjectId,
    
    // Server sync actions (with UI feedback)
    createProject,
    deleteProject
  };
};
