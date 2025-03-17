
import React, { useState, useCallback } from 'react';
import { CalendarCheck, CalendarDays, CheckSquare, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from "@/components/ui/sidebar";
import { Project } from '@/hooks/useProjects';
import { Sheet, SheetContent } from './ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import SidebarContents from './sidebar/SidebarContents';

interface TaskifySidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  projects: Project[];
  isLoadingProjects: boolean;
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  createProject: (data: { name: string, color: string }) => void;
  onAddTask: (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => void;
}

const TaskifySidebar = ({ 
  activeTab, 
  setActiveTab, 
  projects, 
  isLoadingProjects,
  activeProjectId,
  setActiveProjectId,
  createProject,
  onAddTask
}: TaskifySidebarProps) => {
  const { user } = useAuth();
  const { isMobile } = useIsMobile();
  const username = user?.email ? user.email.split('@')[0] : 'User';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
  
  const handleOpenTaskCreation = useCallback(() => {
    console.log('TaskifySidebar: Request to open task creation sheet');
    
    // On mobile, use a different strategy:
    // 1. Set the task sheet to open first so the state change is queued
    // 2. Then close the mobile menu
    if (isMobile) {
      // Set task sheet open first (this gets queued by React)
      setIsTaskSheetOpen(true);
      console.log('TaskifySidebar: Set task sheet to open, now closing mobile menu');
      
      // Then close mobile menu (also queued but will happen in the same render cycle)
      setMobileMenuOpen(false);
    } else {
      // On desktop, simply open the sheet
      console.log('TaskifySidebar: Desktop - opening task sheet directly');
      setIsTaskSheetOpen(true);
    }
  }, [isMobile]);

  const handleTaskSubmit = useCallback((task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => {
    console.log('TaskifySidebar: Task submitted', task);
    onAddTask(task);
    setIsTaskSheetOpen(false);
  }, [onAddTask]);
  
  const handleSheetClose = useCallback((open: boolean) => {
    console.log('TaskifySidebar: Setting sheet open state to:', open);
    setIsTaskSheetOpen(open);
  }, []);
  
  // Removed the "Create Detailed Task" item from navItems
  const navItems = [
    { 
      icon: CalendarCheck, 
      label: "Today", 
      action: () => {
        setActiveTab('tasks');
        setActiveProjectId(null);
        if (isMobile) {
          setMobileMenuOpen(false);
        }
      },
      isActive: activeTab === 'tasks' && !activeProjectId
    },
    { 
      icon: CalendarDays, 
      label: "Upcoming", 
      action: () => {
        setActiveTab('notes');
        setActiveProjectId(null);
        if (isMobile) {
          setMobileMenuOpen(false);
        }
      },
      isActive: activeTab === 'notes' && !activeProjectId
    },
    { 
      icon: CheckSquare, 
      label: "Completed", 
      action: () => {
        setActiveTab('completed');
        setActiveProjectId(null);
        if (isMobile) {
          setMobileMenuOpen(false);
        }
      },
      isActive: activeTab === 'completed' && !activeProjectId
    },
  ];

  const handleProjectClick = (projectId: string) => {
    setActiveProjectId(projectId);
    setActiveTab('tasks');
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const MobileMenuToggle = () => (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className="md:hidden fixed z-50 top-3.5 left-3.5 bg-background/50 backdrop-blur-sm"
      aria-label="Toggle mobile menu"
    >
      {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
    </Button>
  );

  return (
    <>
      <MobileMenuToggle />
      
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-[80%] max-w-[300px] border-r border-white/5">
          <div className="h-full bg-sidebar">
            <SidebarContents 
              username={username}
              navItems={navItems}
              projects={projects}
              isLoadingProjects={isLoadingProjects}
              activeProjectId={activeProjectId}
              handleProjectClick={handleProjectClick}
              createProject={createProject}
              isTaskSheetOpen={isTaskSheetOpen}
              setIsTaskSheetOpen={handleSheetClose}
              onAddTask={handleTaskSubmit}
            />
          </div>
        </SheetContent>
      </Sheet>
      
      <div className="hidden md:block">
        <Sidebar className="border-r border-white/5">
          <SidebarContents 
            username={username}
            navItems={navItems}
            projects={projects}
            isLoadingProjects={isLoadingProjects}
            activeProjectId={activeProjectId}
            handleProjectClick={handleProjectClick}
            createProject={createProject}
            isTaskSheetOpen={isTaskSheetOpen}
            setIsTaskSheetOpen={handleSheetClose}
            onAddTask={handleTaskSubmit}
          />
        </Sidebar>
      </div>
    </>
  );
};

export default TaskifySidebar;
