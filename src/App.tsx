
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { useTaskStore } from "./store/taskStore";
import { useProjectStore } from "./store/projectStore";

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
              <Routes>
                <Route path="/" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
