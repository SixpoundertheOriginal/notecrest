
// This file is kept for backward compatibility
// The functionality has been moved to src/contexts/ProjectContext.tsx
// Please import { useProjects } from '@/contexts/ProjectContext' instead

import { useProjects as useProjectsFromContext } from '@/contexts/ProjectContext';
export { useProjects };
export type { Project } from '@/contexts/ProjectContext';

// Re-export the hook from the context
function useProjects(user?: any) {
  return useProjectsFromContext();
}
