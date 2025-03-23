
import { useTaskStore } from '@/store/taskStore';
import { TaskData } from '@/types/task';

// Task selectors for better re-render performance
export const useTaskSelectors = () => {
  // Use selectors to only subscribe to specific parts of state
  const tasks = useTaskStore(state => state.tasks);
  const isLoadingTasks = useTaskStore(state => state.isLoadingTasks);
  const draggedTaskId = useTaskStore(state => state.draggedTaskId);
  
  return {
    tasks,
    isLoadingTasks,
    draggedTaskId,
    // Computed selectors
    completedTasks: tasks.filter(task => task.completed),
    incompleteTasks: tasks.filter(task => !task.completed),
    getTasksByProject: (projectId: string | null) => 
      projectId ? tasks.filter(task => task.project_id === projectId) : tasks,
    getTaskById: (id: number | string) => 
      tasks.find(task => task.id === id) as TaskData | undefined
  };
};

// Action selectors for tasks
export const useTaskActions = () => {
  return {
    addTask: useTaskStore(state => state.addTask),
    toggleTaskCompletion: useTaskStore(state => state.toggleTaskCompletion),
    toggleTaskExpansion: useTaskStore(state => state.toggleTaskExpansion),
    clearCompletedTasks: useTaskStore(state => state.clearCompletedTasks),
    handleDragStart: useTaskStore(state => state.handleDragStart),
    handleDragOver: useTaskStore(state => state.handleDragOver),
    handleDrop: useTaskStore(state => state.handleDrop)
  };
};
