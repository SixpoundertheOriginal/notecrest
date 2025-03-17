
import React, { useState } from 'react';
import { PlusCircle, CalendarCheck, CalendarDays, CheckSquare, Menu, X } from 'lucide-react';
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
  
  const handleOpenTaskCreation = () => {
    setIsTaskSheetOpen(true);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };
  
  const navItems = [
    { 
      icon: PlusCircle, 
      label: "Create Detailed Task", 
      action: () => handleOpenTaskCreation(),
      highlight: true
    },
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
      className="md:hidden fixed top-4 left-4 z-50 bg-background/50 backdrop-blur-sm"
    >
      {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
              setIsTaskSheetOpen={setIsTaskSheetOpen}
              onAddTask={onAddTask}
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
            setIsTaskSheetOpen={setIsTaskSheetOpen}
            onAddTask={onAddTask}
          />
        </Sidebar>
      </div>
    </>
  );
};

export default TaskifySidebar;
