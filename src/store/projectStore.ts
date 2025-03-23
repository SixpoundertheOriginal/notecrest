
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: string;
  name: string;
  color: string;
  user_id: string;
  task_count?: number;
}

interface ProjectState {
  projects: Project[];
  isLoadingProjects: boolean;
  activeProjectId: string | null;
  
  // Actions
  setProjects: (projects: Project[]) => void;
  setActiveProjectId: (id: string | null) => void;
  fetchProjects: (userId: string | undefined) => Promise<void>;
  createProject: (projectData: { name: string; color: string }, userId: string | undefined) => Promise<Project | null>;
  deleteProject: (projectId: string, userId: string | undefined) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  isLoadingProjects: false,
  activeProjectId: null,
  
  setProjects: (projects) => set({ projects }),
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  
  fetchProjects: async (userId) => {
    set({ isLoadingProjects: true });
    
    if (!userId) {
      // Demo projects for non-authenticated users
      set({
        projects: [
          { id: '1', name: 'Main', color: 'pink', user_id: '0', task_count: 22 },
          { id: '2', name: 'Projects', color: 'blue', user_id: '0', task_count: 34 },
          { id: '3', name: 'Yodel-Work', color: 'orange', user_id: '0', task_count: 17 },
        ],
        isLoadingProjects: false
      });
      return;
    }

    try {
      // Fetch projects from Supabase
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      if (data) {
        // Get task counts for each project
        const projectsWithTaskCounts = await Promise.all(
          data.map(async (project) => {
            const { count, error: countError } = await supabase
              .from('tasks')
              .select('*', { count: 'exact', head: true })
              .eq('project_id', project.id);

            if (countError) {
              console.error('Error fetching task count:', countError);
              return { ...project, task_count: 0 };
            }

            return { ...project, task_count: count || 0 };
          })
        );

        set({ projects: projectsWithTaskCounts });
      }
    } catch (error: any) {
      console.error("Error fetching projects:", error.message);
    } finally {
      set({ isLoadingProjects: false });
    }
  },
  
  createProject: async (projectData, userId) => {
    if (!userId) {
      // For non-authenticated users, just add to local state
      const newId = Math.random().toString(36).substring(2, 11);
      const newProject = {
        id: newId,
        name: projectData.name,
        color: projectData.color,
        user_id: '0',
        task_count: 0,
      };
      
      set(state => ({ projects: [...state.projects, newProject] }));
      return newProject;
    }

    try {
      // Create project in Supabase
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: projectData.name,
          color: projectData.color,
          user_id: userId,
        })
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        const newProject = { ...data[0], task_count: 0 };
        set(state => ({ projects: [...state.projects, newProject] }));
        return newProject;
      }
    } catch (error: any) {
      console.error("Error creating project:", error.message);
    }

    return null;
  },
  
  deleteProject: async (projectId, userId) => {
    const projects = get().projects;
    const activeProjectId = get().activeProjectId;
    
    if (!userId) {
      // For non-authenticated users, just remove from local state
      set({ 
        projects: projects.filter(project => project.id !== projectId),
        activeProjectId: activeProjectId === projectId ? null : activeProjectId
      });
      return;
    }

    try {
      // Delete project from Supabase
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        throw error;
      }

      // Update local state
      set({ 
        projects: projects.filter(project => project.id !== projectId),
        activeProjectId: activeProjectId === projectId ? null : activeProjectId
      });
    } catch (error: any) {
      console.error("Error deleting project:", error.message);
    }
  }
}));
