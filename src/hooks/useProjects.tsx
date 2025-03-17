
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Project {
  id: string;
  name: string;
  color: string;
  user_id: string;
  task_count?: number;
}

export const useProjects = (user: any) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        // Demo projects for non-authenticated users
        setProjects([
          { id: '1', name: 'Main', color: 'pink', user_id: '0', task_count: 22 },
          { id: '2', name: 'Projects', color: 'blue', user_id: '0', task_count: 34 },
          { id: '3', name: 'Yodel-Work', color: 'orange', user_id: '0', task_count: 17 },
        ]);
        return;
      }

      setIsLoadingProjects(true);
      try {
        // Fetch projects from Supabase
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

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

          setProjects(projectsWithTaskCounts);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching projects",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [user, toast]);

  const createProject = async (projectData: { name: string; color: string }) => {
    if (!user) {
      // For non-authenticated users, just add to local state
      const newId = Math.random().toString(36).substring(2, 11);
      const newProject = {
        id: newId,
        name: projectData.name,
        color: projectData.color,
        user_id: '0',
        task_count: 0,
      };
      setProjects([...projects, newProject]);
      
      toast({
        title: "Project created (Demo Mode)",
        description: "Sign in to save your projects permanently.",
      });
      
      return newProject;
    }

    try {
      // Create project in Supabase
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: projectData.name,
          color: projectData.color,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const newProject = { ...data, task_count: 0 };
        setProjects([...projects, newProject]);
        
        toast({
          title: "Project created",
          description: "Your project has been added successfully.",
        });
        
        return newProject;
      }
    } catch (error: any) {
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
    }

    return null;
  };

  const deleteProject = async (projectId: string) => {
    if (!user) {
      // For non-authenticated users, just remove from local state
      setProjects(projects.filter(project => project.id !== projectId));
      if (activeProjectId === projectId) {
        setActiveProjectId(null);
      }
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
      setProjects(projects.filter(project => project.id !== projectId));
      if (activeProjectId === projectId) {
        setActiveProjectId(null);
      }
      
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    }
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
