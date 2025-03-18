
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CalendarSettings from "./components/calendar/CalendarSettings";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./lib/microsoftAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        {(authProps) => (
          <ThemeProvider>
            <ProjectProvider user={authProps.user}>
              <TooltipProvider>
                <SidebarProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <div className="flex min-h-svh w-full">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/settings/calendar" element={<CalendarSettings />} />
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                  </BrowserRouter>
                </SidebarProvider>
              </TooltipProvider>
            </ProjectProvider>
          </ThemeProvider>
        )}
      </AuthProvider>
    </MsalProvider>
  </QueryClientProvider>
);

export default App;
