
import { TaskData } from "@/types/task";

/**
 * Filter tasks by completion status
 * @param tasks Array of tasks
 * @param showCompleted Whether to show completed tasks
 * @returns Filtered tasks array
 */
export const filterTasksByCompletion = (tasks: TaskData[], showCompleted: boolean): TaskData[] => {
  return tasks.filter(task => task.completed === showCompleted);
};

/**
 * Filter tasks by project ID
 * @param tasks Array of tasks
 * @param projectId Project ID to filter by (optional)
 * @returns Filtered tasks array
 */
export const filterTasksByProject = (tasks: TaskData[], projectId?: string | null): TaskData[] => {
  return projectId ? tasks.filter(task => task.project_id === projectId) : tasks;
};

/**
 * Sort tasks based on the selected option
 * @param tasks Array of tasks to sort
 * @param sortOption Sort option string (date-desc, date-asc, priority-desc, title-asc)
 * @returns Sorted copy of the tasks array
 */
export const sortTasks = (tasks: TaskData[], sortOption: string = "date-desc"): TaskData[] => {
  // Create a copy to avoid mutating the original array
  const tasksCopy = [...tasks];
  
  switch (sortOption) {
    case 'date-asc':
      return tasksCopy.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    case 'priority-desc':
      return tasksCopy.sort((a, b) => {
        const priorityValue = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return (priorityValue[b.priority] || 0) - (priorityValue[a.priority] || 0);
      });
    case 'title-asc':
      return tasksCopy.sort((a, b) => a.title.localeCompare(b.title));
    case 'date-desc':
    default:
      return tasksCopy.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }
};

/**
 * Filter tasks for today
 * @param tasks Array of tasks
 * @returns Tasks for today
 */
export const filterTasksForToday = (tasks: TaskData[]): TaskData[] => {
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  return tasks.filter(task => {
    if (!task.date) return false;
    
    // Try to match formats like "Mar 18" or similar
    return task.date === today || 
           task.date.includes(today) || 
           // Also check if the date is today in another format
           (task.createdAt && new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === today);
  });
};

/**
 * Get task metrics - counts and statistics about tasks
 * @param tasks Array of tasks
 * @returns Object with task metrics
 */
export const getTaskMetrics = (tasks: TaskData[]) => {
  // Only consider visible tasks (not completed)
  const visibleTasks = tasks.filter(task => !task.completed);
  const totalTasks = visibleTasks.length;
  const completedTasks = 0; // These are filtered out already
  
  const todayTasks = filterTasksForToday(visibleTasks).length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const highPriorityTasks = visibleTasks.filter(task => task.priority === 'High').length;
  
  return {
    totalTasks,
    completedTasks,
    todayTasks,
    completionRate,
    highPriorityTasks,
    allTasksCount: tasks.length,
    completedTasksCount: tasks.filter(task => task.completed).length
  };
};
