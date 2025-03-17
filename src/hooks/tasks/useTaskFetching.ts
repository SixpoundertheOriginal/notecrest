
import { useState, useEffect } from 'react';
import { TaskData } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useTaskFetching = (user: any) => {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) {
        setTasks([
          { 
            id: 1, 
            title: 'Complete project proposal (Demo)', 
            completed: false, 
            priority: 'High', 
            status: 'In Progress' as 'Todo' | 'In Progress' | 'Completed', 
            date: 'Mar 8',
            expanded: false,
            project_id: '1', // Main project
            createdAt: new Date(Date.now() - 1000 * 60 * 42), // 42 minutes ago
            subtasks: []
          },
          { 
            id: 2, 
            title: 'Review and respond to emails (Demo)', 
            completed: false, 
            priority: 'Medium', 
            status: 'Todo' as 'Todo' | 'In Progress' | 'Completed', 
            date: 'Mar 6',
            expanded: false,
            project_id: '2', // Projects project
            createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
            subtasks: []
          },
        ]);
        return;
      }

      setIsLoadingTasks(true);
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          const formattedTasks = data.map(task => ({
            id: task.id,
            title: task.title,
            completed: task.completed,
            priority: task.priority as 'High' | 'Medium' | 'Low',
            status: task.status as 'Todo' | 'In Progress' | 'Completed',
            date: task.date,
            expanded: false,
            createdAt: new Date(task.created_at),
            user_id: task.user_id,
            project_id: task.project_id || null,
            subtasks: task.subtasks || []
          }));
          setTasks(formattedTasks);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching tasks",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoadingTasks(false);
      }
    };

    fetchTasks();
  }, [user, toast]);

  return { tasks, setTasks, isLoadingTasks };
};
