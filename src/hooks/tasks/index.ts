
import { useTaskFetching } from './useTaskFetching';
import { useTaskManipulation } from './useTaskManipulation';
import { useTaskCreation } from './useTaskCreation';
import { useTaskCleanup } from './useTaskCleanup';
import { UseTasksReturn } from './types';

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

export * from './types';
