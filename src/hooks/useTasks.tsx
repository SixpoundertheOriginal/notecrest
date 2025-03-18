
// This file is kept for backward compatibility
// The functionality has been moved to src/contexts/TasksContext.tsx
// Please import { useTasks } from '@/contexts/TasksContext' instead

import { useTasks as useTasksFromContext } from '@/contexts/TasksContext';
export { useTasks };
export type { UseTasksReturn } from '@/hooks/tasks/types';

// Re-export the hook from the context
function useTasks(user?: any) {
  return useTasksFromContext();
}
