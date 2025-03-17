
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  PlusCircle, Search, Inbox, CalendarCheck, 
  CalendarDays, CheckSquare, Hash, User 
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
} from "@/components/ui/sidebar";
import { Button } from './ui/button';
import AuthSection from './app/AuthSection';

interface SidebarNavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive?: boolean;
  count?: number;
}

const SidebarNavItem = ({ icon: Icon, label, to, isActive, count }: SidebarNavItemProps) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild 
        isActive={isActive}
        tooltip={label}
      >
        <NavLink 
          to={to}
          className={({ isActive }) => cn(
            isActive && "text-blue-400"
          )}
        >
          <Icon size={18} />
          <span>{label}</span>
          {count !== undefined && count > 0 && (
            <span className="ml-auto text-xs opacity-60">{count}</span>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const TaskifySidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const { user } = useAuth();
  const username = user?.email ? user.email.split('@')[0] : 'User';
  
  // Navigation items setup
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
      action: () => setActiveTab('tasks'),
      isActive: activeTab === 'tasks'
    },
    { 
      icon: CalendarDays, 
      label: "Upcoming", 
      action: () => setActiveTab('notes'),
      isActive: activeTab === 'notes'
    },
    { 
      icon: CheckSquare, 
      label: "Completed", 
      action: () => setActiveTab('completed'),
      isActive: activeTab === 'completed'
    },
  ];
  
  const projects = [
    { name: "Main", count: 22, color: "pink" },
    { name: "Projects", count: 34, color: "blue" },
    { name: "Yodel-Work", count: 17, color: "orange" },
  ];

  return (
    <Sidebar className="border-r border-white/5">
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
                  {item.action ? (
                    <SidebarMenuButton 
                      onClick={item.action}
                      isActive={item.isActive}
                      tooltip={item.label}
                      className={item.highlight ? "text-red-400 hover:text-red-300" : ""}
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                      {item.count !== undefined && item.count > 0 && (
                        <span className="ml-auto text-xs opacity-60">{item.count}</span>
                      )}
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton 
                      asChild 
                      isActive={item.isActive}
                      tooltip={item.label}
                    >
                      <div className="cursor-pointer">
                        <item.icon size={18} />
                        <span>{item.label}</span>
                        {item.count !== undefined && item.count > 0 && (
                          <span className="ml-auto text-xs opacity-60">{item.count}</span>
                        )}
                      </div>
                    </SidebarMenuButton>
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
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Hash size={18} className="text-blue-400" />
                  <span>Projects</span>
                  <span className="ml-auto text-xs opacity-60">34</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        {/* My Projects section */}
        <SidebarGroup>
          <SidebarGroupLabel>My Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map(project => (
                <SidebarMenuItem key={project.name}>
                  <SidebarMenuButton>
                    <Hash size={18} className={
                      project.color === "blue" ? "text-blue-400" : 
                      project.color === "pink" ? "text-pink-400" : 
                      "text-orange-400"
                    } />
                    <span>{project.name}</span>
                    <span className="ml-auto text-xs opacity-60">{project.count}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
    </Sidebar>
  );
};

export default TaskifySidebar;
