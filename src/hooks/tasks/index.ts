
import { useTaskFetching } from './useTaskFetching';
import { useTaskManipulation } from './useTaskManipulation';
import { useTaskCreation } from './useTaskCreation';
import { useTaskCleanup } from './useTaskCleanup';
import { UseTasksReturn } from './types';
import { TaskData } from '@/types/task';

export const useTasks = (user: any): UseTasksReturn => {
  const { tasks, setTasks, isLoadingTasks } = useTaskFetching(user);
  const { addTask } = useTaskCreation(tasks, setTasks, user);
  const { 
    draggedTaskId, 
    toggleTaskCompletion, 
    toggleTaskExpansion, 
    handleDragStart, 
    handleDragOver, 
    handleDrop 
  } = useTaskManipulation(tasks, setTasks, user);
  const { clearCompletedTasks } = useTaskCleanup(tasks, setTasks, user);

  // Add the updateTask function
  const updateTask = async (updatedTask: TaskData): Promise<boolean> => {
    try {
      // Implement a simple update logic for local state
      setTasks(currentTasks => 
        currentTasks.map(task => 
          task.id === updatedTask.id ? updatedTask : task
        )
      );
      return true;
    } catch (error) {
      console.error("Error updating task:", error);
      return false;
    }
  };

  return {
    tasks,
    isLoadingTasks,
    draggedTaskId,
    toggleTaskCompletion,
    toggleTaskExpansion,
    addTask,
    updateTask,
    handleDragStart,
    handleDragOver,
    handleDrop,
    clearCompletedTasks
  };
};

export * from './types';
