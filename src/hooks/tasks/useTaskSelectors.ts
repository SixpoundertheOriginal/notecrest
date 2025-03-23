
import { useTaskStore } from '@/store/taskStore';
import { TaskData } from '@/types/task';

// Task selectors for better re-render performance
export const useTaskSelectors = () => {
  // Use selectors to only subscribe to specific parts of state
  const tasks = useTaskStore(state => state.tasks);
  const isLoadingTasks = useTaskStore(state => state.isLoadingTasks);
  const draggedTaskId = useTaskStore(state => state.draggedTaskId);
  const isSaving = useTaskStore(state => state.isSaving);
  
  return {
    // Server-derived state
    tasks,
    isLoadingTasks,
    isSaving,
    
    // Client-only state
    draggedTaskId,
    
    // Computed selectors (derived state)
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
    // UI actions (client state)
    toggleTaskExpansion: useTaskStore(state => state.toggleTaskExpansion),
    handleDragStart: useTaskStore(state => state.handleDragStart),
    handleDragOver: useTaskStore(state => state.handleDragOver),
    
    // Server sync actions (modifies both client & server state)
    addTask: useTaskStore(state => state.addTask),
    updateTask: useTaskStore(state => state.updateTask),
    toggleTaskCompletion: useTaskStore(state => state.toggleTaskCompletion),
    clearCompletedTasks: useTaskStore(state => state.clearCompletedTasks),
    handleDrop: useTaskStore(state => state.handleDrop)
  };
};
