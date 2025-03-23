
import { lazy, ComponentType, Suspense, ReactNode } from 'react';

// Simple loading component for any lazily loaded component
export const ComponentLoader = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center justify-center w-full h-32">
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
    {children}
  </div>
);

// Helper function to create a lazy component with proper typing and suspense
export function createLazyComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  fallback: ReactNode = <ComponentLoader>Loading...</ComponentLoader>
) {
  const LazyComponent = lazy(factory);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Export lazy-loaded versions of heavy components
export const LazyTaskDetails = createLazyComponent(() => import('@/components/TaskDetails'));
export const LazyCompletedTasksView = createLazyComponent(() => import('@/components/CompletedTasksView'));
export const LazyTaskCreationSheet = createLazyComponent(() => import('@/components/TaskCreationSheet'));
