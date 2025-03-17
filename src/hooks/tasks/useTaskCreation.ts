
import { useState } from 'react';
import { TaskData } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useTaskCreation = (
  tasks: TaskData[], 
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>,
  user: any
) => {
  const { toast } = useToast();

  const addTask = async (taskData: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
    projectId?: string;
  }) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (user) {
      try {
        // Create a properly typed task object that matches Supabase's expectations
        const newTaskData = {
          title: taskData.title,
          completed: false,
          priority: taskData.priority,
          status: 'Todo',
          date: formattedDate,
          user_id: user.id,
          project_id: taskData.projectId || null
        };
        
        const { data, error } = await supabase
          .from('tasks')
          .insert(newTaskData)
          .select();

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const formattedTask: TaskData = {
            id: data[0].id,
            title: data[0].title,
            completed: data[0].completed,
            priority: data[0].priority as 'High' | 'Medium' | 'Low',
            status: data[0].status as 'Todo' | 'In Progress' | 'Completed',
            date: data[0].date,
            expanded: false,
            createdAt: new Date(data[0].created_at),
            user_id: data[0].user_id,
            project_id: data[0].project_id || null,
            subtasks: []
          };
          
          setTasks([formattedTask, ...tasks]);
          
          toast({
            title: "Task created",
            description: "Your task has been added to the list.",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error creating task",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      const newId = Math.max(0, ...tasks.map(task => typeof task.id === 'number' ? task.id : 0)) + 1;
      
      const newTask: TaskData = {
        id: newId,
        title: taskData.title,
        completed: false,
        priority: taskData.priority as 'High' | 'Medium' | 'Low',
        status: 'Todo',
        date: formattedDate,
        expanded: false,
        createdAt: currentDate,
        project_id: taskData.projectId || null,
        subtasks: []
      };
      
      setTasks([newTask, ...tasks]);
      
      toast({
        title: "Task created (Demo Mode)",
        description: "Sign in to save your tasks permanently.",
      });
    }
  };

  return { addTask };
};
