
import { lazy, Suspense } from 'react';

// Lazy load the TaskifyApp component
const TaskifyApp = lazy(() => import('@/components/TaskifyApp'));

// Simple loading component
const TaskifyLoader = () => (
  <div className="flex items-center justify-center w-full h-screen">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

const Index = () => {
  return (
    <Suspense fallback={<TaskifyLoader />}>
      <TaskifyApp />
    </Suspense>
  );
};

export default Index;
