
import { useState, useEffect } from 'react';
import { TaskData, NewTaskData } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useTasks = (user: any) => {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [draggedTaskId, setDraggedTaskId] = useState<number | string | null>(null);
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
            createdAt: new Date(Date.now() - 1000 * 60 * 42) // 42 minutes ago
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
            createdAt: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
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
            project_id: task.project_id || null
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

  const toggleTaskCompletion = async (id: number | string) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;

    const newStatus = !taskToUpdate.completed 
      ? 'Completed' as const
      : taskToUpdate.status === 'Completed' 
        ? 'Todo' as const 
        : taskToUpdate.status;
        
    const updatedTasks = tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            completed: !task.completed,
            status: newStatus
          } 
        : task
    );
    setTasks(updatedTasks);

    if (user && typeof id === 'string') {
      try {
        const { error } = await supabase
          .from('tasks')
          .update({ 
            completed: !taskToUpdate.completed,
            status: newStatus
          })
          .eq('id', id);

        if (error) {
          throw error;
        }
      } catch (error: any) {
        setTasks(tasks);
        toast({
          title: "Error updating task",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const toggleTaskExpansion = (id: number | string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, expanded: !task.expanded } : { ...task, expanded: false }
    ));
  };

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
            project_id: data[0].project_id || null
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
        project_id: taskData.projectId || null
      };
      
      setTasks([newTask, ...tasks]);
      
      toast({
        title: "Task created (Demo Mode)",
        description: "Sign in to save your tasks permanently.",
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, id: number | string) => {
    setDraggedTaskId(id);
    const element = e.currentTarget;
    element.classList.add('scale-105');
    setTimeout(() => element.classList.remove('scale-105'), 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetId: number | string) => {
    e.preventDefault();
    
    if (draggedTaskId === null || draggedTaskId === targetId) return;
    
    const tasksCopy = [...tasks];
    const draggedTaskIndex = tasksCopy.findIndex(task => task.id === draggedTaskId);
    const targetTaskIndex = tasksCopy.findIndex(task => task.id === targetId);
    
    const [draggedTask] = tasksCopy.splice(draggedTaskIndex, 1);
    tasksCopy.splice(targetTaskIndex, 0, draggedTask);
    
    setTasks(tasksCopy);
    setDraggedTaskId(null);
  };

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

  return {
    tasks,
    isLoadingTasks,
    draggedTaskId,
    toggleTaskCompletion,
    toggleTaskExpansion,
    addTask,
    handleDragStart,
    handleDragOver,
    handleDrop,
    clearCompletedTasks
  };
};
