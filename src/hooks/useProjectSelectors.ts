
import { useProjectStore } from '@/store/projectStore';
import { Project } from '@/store/projectStore';

// Project selectors for better re-render performance
export const useProjectSelectors = () => {
  const projects = useProjectStore(state => state.projects);
  const isLoadingProjects = useProjectStore(state => state.isLoadingProjects);
  const activeProjectId = useProjectStore(state => state.activeProjectId);
  
  return {
    projects,
    isLoadingProjects,
    activeProjectId,
    // Computed selectors
    getProjectById: (id: string) => 
      projects.find(project => project.id === id) as Project | undefined,
    activeProject: activeProjectId ? 
      projects.find(project => project.id === activeProjectId) : null
  };
};

// Action selectors for projects
export const useProjectActions = () => {
  return {
    setActiveProjectId: useProjectStore(state => state.setActiveProjectId),
    createProject: useProjectStore(state => state.createProject),
    deleteProject: useProjectStore(state => state.deleteProject)
  };
};
