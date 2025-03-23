
import { useProjectStore } from '@/store/projectStore';
import { Project } from '@/store/projectStore';

// Project selectors for better re-render performance
export const useProjectSelectors = () => {
  // Server-derived state
  const projects = useProjectStore(state => state.projects);
  const isLoadingProjects = useProjectStore(state => state.isLoadingProjects);
  
  // Client-only state
  const activeProjectId = useProjectStore(state => state.activeProjectId);
  
  return {
    // Server state
    projects,
    isLoadingProjects,
    
    // Client state
    activeProjectId,
    
    // Computed selectors (derived state)
    getProjectById: (id: string) => 
      projects.find(project => project.id === id) as Project | undefined,
    activeProject: activeProjectId ? 
      projects.find(project => project.id === activeProjectId) : null
  };
};

// Action selectors for projects
export const useProjectActions = () => {
  return {
    // UI actions (client state only)
    setActiveProjectId: useProjectStore(state => state.setActiveProjectId),
    
    // Server sync actions (modifies both client & server state)
    createProject: useProjectStore(state => state.createProject),
    deleteProject: useProjectStore(state => state.deleteProject)
  };
};
