import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  PlusCircle, Search, Inbox, CalendarCheck, 
  CalendarDays, CheckSquare, Hash, User, 
  Plus, Trash2, Settings, MoreHorizontal, Menu, X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { Button } from './ui/button';
import AuthSection from './app/AuthSection';
import { Project } from '@/hooks/useProjects';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

interface SidebarNavItemProps {
  icon: React.ElementType;
  label: string;
  to?: string;
  action?: () => void;
  isActive?: boolean;
  count?: number;
  highlight?: boolean;
}

const SidebarNavItem = ({ 
  icon: Icon, 
  label, 
  to, 
  action, 
  isActive, 
  count, 
  highlight 
}: SidebarNavItemProps) => {
  return (
    <SidebarMenuItem>
      {action ? (
        <SidebarMenuButton 
          onClick={action}
          isActive={isActive}
          tooltip={label}
          className={highlight ? "text-red-400 hover:text-red-300" : ""}
        >
          <Icon size={18} />
          <span>{label}</span>
          {count !== undefined && count > 0 && (
            <span className="ml-auto text-xs opacity-60">{count}</span>
          )}
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton 
          asChild 
          isActive={isActive}
          tooltip={label}
        >
          <div className="cursor-pointer">
            <Icon size={18} />
            <span>{label}</span>
            {count !== undefined && count > 0 && (
              <span className="ml-auto text-xs opacity-60">{count}</span>
            )}
          </div>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
};

const ProjectDialog = ({ onCreateProject }: { onCreateProject: (data: { name: string, color: string }) => void }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('blue');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateProject({ name, color });
      setName('');
    }
  };
  
  const colors = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  ];
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Plus size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create new project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Project name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Select color
              </label>
              <div className="flex gap-2">
                {colors.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    className={cn(
                      "w-6 h-6 rounded-full ring-offset-2",
                      c.class,
                      color === c.value && "ring-2 ring-white"
                    )}
                    onClick={() => setColor(c.value)}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" disabled={!name.trim()}>Create</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface TaskifySidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  projects: Project[];
  isLoadingProjects: boolean;
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  createProject: (data: { name: string, color: string }) => void;
}

const TaskifySidebar = ({ 
  activeTab, 
  setActiveTab, 
  projects, 
  isLoadingProjects,
  activeProjectId,
  setActiveProjectId,
  createProject
}: TaskifySidebarProps) => {
  const { user } = useAuth();
  const { isMobile } = useIsMobile();
  const username = user?.email ? user.email.split('@')[0] : 'User';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { 
      icon: PlusCircle, 
      label: "Add task", 
      action: () => document.getElementById('add-task-button')?.click(),
      highlight: true
    },
    { 
      icon: Search, 
      label: "Search", 
      to: "/search", 
      action: () => console.log("Search clicked") 
    },
    { 
      icon: Inbox, 
      label: "Inbox", 
      to: "/inbox",
      count: 0
    },
    { 
      icon: CalendarCheck, 
      label: "Today", 
      action: () => {
        setActiveTab('tasks');
        setActiveProjectId(null);
      },
      isActive: activeTab === 'tasks' && !activeProjectId
    },
    { 
      icon: CalendarDays, 
      label: "Upcoming", 
      action: () => {
        setActiveTab('notes');
        setActiveProjectId(null);
      },
      isActive: activeTab === 'notes' && !activeProjectId
    },
    { 
      icon: CheckSquare, 
      label: "Completed", 
      action: () => {
        setActiveTab('completed');
        setActiveProjectId(null);
      },
      isActive: activeTab === 'completed' && !activeProjectId
    },
  ];
  
  const favoritedProjects = projects.filter(project => 
    project.name.toLowerCase() === 'projects' || 
    project.name.toLowerCase() === 'main'
  );

  const handleProjectClick = (projectId: string) => {
    setActiveProjectId(projectId);
    setActiveTab('tasks'); // Reset to tasks view when clicking on a project
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

  const SidebarContents = () => (
    <>
      <SidebarHeader className="px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User size={16} className="text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{username}</span>
            <span className="text-xs text-muted-foreground">Free Plan</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Main navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item, index) => (
                <SidebarNavItem 
                  key={item.label} 
                  {...item} 
                  action={() => {
                    if (item.action) {
                      item.action();
                      if (isMobile) {
                        setMobileMenuOpen(false);
                      }
                    }
                  }}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        {/* Favorites section */}
        <SidebarGroup>
          <SidebarGroupLabel>Favorites</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {favoritedProjects.map(project => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton 
                    isActive={activeProjectId === project.id}
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <Hash size={18} className={
                      project.color === "blue" ? "text-blue-400" : 
                      project.color === "pink" ? "text-pink-400" : 
                      project.color === "green" ? "text-green-400" : 
                      project.color === "purple" ? "text-purple-400" : 
                      "text-orange-400"
                    } />
                    <span>{project.name}</span>
                    <span className="ml-auto text-xs opacity-60">{project.task_count}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        {/* My Projects section */}
        <SidebarGroup>
          <div className="flex items-center justify-between px-4 py-2">
            <SidebarGroupLabel>My Projects</SidebarGroupLabel>
            <ProjectDialog onCreateProject={createProject} />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects
                .filter(project => 
                  project.name.toLowerCase() !== 'projects' && 
                  project.name.toLowerCase() !== 'main'
                )
                .map(project => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton 
                    isActive={activeProjectId === project.id}
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <Hash size={18} className={
                      project.color === "blue" ? "text-blue-400" : 
                      project.color === "pink" ? "text-pink-400" : 
                      project.color === "green" ? "text-green-400" : 
                      project.color === "purple" ? "text-purple-400" : 
                      "text-orange-400"
                    } />
                    <span>{project.name}</span>
                    <span className="ml-auto text-xs opacity-60">{project.task_count}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {projects.length === 0 && !isLoadingProjects && (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  No projects yet. Create one to get started.
                </div>
              )}
              {isLoadingProjects && (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  Loading projects...
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-white/5">
        <div className="p-2">
          <Button variant="ghost" className="w-full justify-start px-2 text-muted-foreground">
            <Search size={16} className="mr-2" />
            <span className="text-xs">Quick search...</span>
            <span className="ml-auto opacity-60 text-xs">⌘K</span>
          </Button>
        </div>
      </SidebarFooter>
    </>
  );

  return (
    <>
      <MobileMenuToggle />
      
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-[80%] max-w-[300px] border-r border-white/5">
          <div className="h-full bg-sidebar">
            <SidebarContents />
          </div>
        </SheetContent>
      </Sheet>
      
      <div className="hidden md:block">
        <Sidebar className="border-r border-white/5">
          <SidebarContents />
        </Sidebar>
      </div>
    </>
  );
};

export default TaskifySidebar;
