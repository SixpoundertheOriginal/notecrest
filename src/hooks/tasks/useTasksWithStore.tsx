
import { useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { useToast } from '@/components/ui/use-toast';
import { UseTasksReturn } from './types';
import { useTaskSelectors, useTaskActions } from './useTaskSelectors';
import { TaskData } from '@/types/task';

export const useTasksWithStore = (user: any): UseTasksReturn => {
  const { toast } = useToast();
  const userId = user?.id;
  
  // Get task state with selectors - separated by server/client concerns
  const { tasks, isLoadingTasks, draggedTaskId } = useTaskSelectors();
  
  // Get task actions - separated by whether they modify server state
  const {
    // Server sync actions
    toggleTaskCompletion: storeToggleTaskCompletion,
    clearCompletedTasks: storeClearCompletedTasks,
    addTask: storeAddTask,
    updateTask: storeUpdateTask,
    handleDrop: storeHandleDrop,
    
    // Client-only actions
    toggleTaskExpansion,
    handleDragStart,
    handleDragOver
  } = useTaskActions();
  
  // Server state initialization
  const fetchTasks = useTaskStore(state => state.fetchTasks);

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

  const updateTask = async (updatedTask: TaskData) => {
    try {
      await storeUpdateTask(updatedTask, userId);
      
      toast({
        title: user ? "Task updated" : "Task updated (Demo Mode)",
        description: user ? "Your task has been updated." : "Sign in to save your changes permanently.",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to update task:", error);
      
      toast({
        title: "Update failed",
        description: "There was a problem updating your task.",
        variant: "destructive"
      });
      
      return false;
    }
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
    // Server-derived state
    tasks,
    isLoadingTasks,
    
    // Client-only state
    draggedTaskId,
    
    // Client-only actions
    toggleTaskExpansion,
    handleDragStart,
    handleDragOver,
    
    // Server sync actions (with UI feedback)
    toggleTaskCompletion,
    addTask,
    updateTask,
    handleDrop,
    clearCompletedTasks
  };
};
