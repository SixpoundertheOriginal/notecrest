
import { TaskData } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useTaskCleanup = (
  tasks: TaskData[],
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>,
  user: any
) => {
  const { toast } = useToast();

  const clearCompletedTasks = async () => {
    if (!user) {
      setTasks(tasks.filter(task => !task.completed));
      toast({
        title: "Completed tasks cleared (Demo Mode)",
        description: "Sign in to save your changes permanently.",
      });
      return;
    }
    
    const completedTaskIds = tasks
      .filter(task => task.completed && typeof task.id === 'string')
      .map(task => task.id as string);
      
    if (completedTaskIds.length === 0) return;
    
    try {
      const remainingTasks = tasks.filter(task => !task.completed);
      setTasks(remainingTasks);
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .in('id', completedTaskIds);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Completed tasks cleared",
        description: `${completedTaskIds.length} task(s) removed.`,
      });
    } catch (error: any) {
      toast({
        title: "Error clearing tasks",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return { clearCompletedTasks };
};
