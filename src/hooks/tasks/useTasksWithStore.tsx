
import { useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { useToast } from '@/components/ui/use-toast';
import { UseTasksReturn } from './types';

export const useTasksWithStore = (user: any): UseTasksReturn => {
  const toast = useToast();
  const userId = user?.id;
  
  const {
    tasks,
    isLoadingTasks,
    draggedTaskId,
    fetchTasks,
    addTask: storeAddTask,
    toggleTaskCompletion: storeToggleTaskCompletion,
    toggleTaskExpansion,
    handleDragStart,
    handleDragOver,
    handleDrop: storeHandleDrop,
    clearCompletedTasks: storeClearCompletedTasks
  } = useTaskStore();

  useEffect(() => {
    fetchTasks(userId);
  }, [fetchTasks, userId]);

  // Wrap store functions to add toast notifications
  const addTask = async (taskData: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
    projectId?: string;
  }) => {
    await storeAddTask(taskData, userId);
    
    toast({
      title: user ? "Task created" : "Task created (Demo Mode)",
      description: user ? "Your task has been added to the list." : "Sign in to save your tasks permanently.",
    });
  };

  const toggleTaskCompletion = async (id: number | string) => {
    await storeToggleTaskCompletion(id, userId);
  };

  const handleDrop = async (e: React.DragEvent, targetId: number | string) => {
    await storeHandleDrop(e, targetId, userId);
  };

  const clearCompletedTasks = async () => {
    await storeClearCompletedTasks(userId);
    
    toast({
      title: user ? "Completed tasks cleared" : "Completed tasks cleared (Demo Mode)",
      description: user ? "Tasks have been removed." : "Sign in to save your changes permanently.",
    });
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
