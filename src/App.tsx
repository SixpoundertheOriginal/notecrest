
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect, lazy, Suspense } from "react";
import { useTaskStore } from "./store/taskStore";
import { useProjectStore } from "./store/projectStore";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Pre-load the stores to ensure hydration
const InitializeStores = () => {
  const fetchTasks = useTaskStore(state => state.fetchTasks);
  const fetchProjects = useProjectStore(state => state.fetchProjects);
  
  useEffect(() => {
    // Initialize with demo data
    fetchTasks(undefined);
    fetchProjects(undefined);
  }, [fetchTasks, fetchProjects]);
  
  return null;
};

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center w-full h-screen">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <SidebarProvider>
          <InitializeStores />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex min-h-svh w-full">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
