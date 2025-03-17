import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  PlusCircle, Search, CalendarCheck, 
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
  DialogDescription,
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
import TaskCreationSheet from './TaskCreationSheet';
import { useTasks } from '@/hooks/useTasks';
import { TaskData } from '@/types/task';

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

const SearchDialog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { tasks } = useTasks(user);
  const [searchResults, setSearchResults] = useState<TaskData[]>([]);
  const { isMobile } = useIsMobile();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(query) || 
      (task.description && task.description.toLowerCase().includes(query))
    );
    
    setSearchResults(filtered);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors cursor-pointer">
          <Search size={18} className="text-blue-400" />
          <span>Search</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Search Tasks</DialogTitle>
          <DialogDescription>
            Search through your tasks by title or description
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10"
              autoFocus
            />
          </div>
          <Button 
            type="button" 
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((task) => (
                <div 
                  key={task.id} 
                  className="rounded-md border p-3 hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => {
                    console.log("Selected task:", task);
                    setIsOpen(false);
                  }}
                >
                  <div className="font-medium">{task.title}</div>
                  {task.description && (
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {task.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="py-6 text-center text-muted-foreground">
              No results found
            </div>
          ) : null}
        </div>
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
      icon: Search, 
      label: "Search", 
      component: <SearchDialog />, 
      isActive: false
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
                <SidebarMenuItem key={item.label}>
                  {item.component ? (
                    <SidebarMenuButton className="px-2 py-2">
                      {item.component}
                    </SidebarMenuButton>
                  ) : (
                    <SidebarNavItem 
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
                  )}
                </SidebarMenuItem>
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
          <Button variant="ghost" className="w-full justify-start px-2 bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
            <Search size={16} className="mr-2 text-blue-400" />
            <span className="text-xs">Quick search...</span>
            <span className="ml-auto opacity-60 text-xs">⌘K</span>
          </Button>
        </div>
      </SidebarFooter>
      
      {/* Task Creation Sheet */}
      <TaskCreationSheet 
        isOpen={isTaskSheetOpen}
        onClose={() => setIsTaskSheetOpen(false)}
        onSubmit={(task) => {
          onAddTask(task);
          setIsTaskSheetOpen(false);
        }}
      />
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
