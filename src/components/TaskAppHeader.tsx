
import React, { useState } from 'react';
import { MoonIcon, SunIcon, LogIn, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AuthSection from './app/AuthSection';
import { useAuth } from '@/hooks/useAuth';
import TaskCreationSheet from './TaskCreationSheet';
import AddTaskButton from './AddTaskButton';

interface TaskAppHeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  pageTitle: string;
  isLoggedIn?: boolean;
  onOpenAuth?: () => void;
  onAddTask: (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => void;
}

const TaskAppHeader = ({ 
  darkMode, 
  toggleTheme, 
  pageTitle, 
  isLoggedIn, 
  onOpenAuth,
  onAddTask
}: TaskAppHeaderProps) => {
  const { user, loading } = useAuth();
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
  
  const handleTaskSubmit = (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => {
    console.log('TaskAppHeader: Task submitted', task);
    onAddTask(task);
    setIsTaskSheetOpen(false);
  };
  
  const handleSheetOpenChange = (open: boolean) => {
    console.log('TaskAppHeader: Sheet state changing to:', open);
    setIsTaskSheetOpen(open);
  };
  
  return (
    <header className="px-4 py-3 flex items-center justify-between border-b border-white/5">
      <div className="flex items-center">
        <h1 className="text-lg font-medium ml-2 md:ml-0">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-2">
        {/* Add Task Button */}
        <AddTaskButton
          darkMode={darkMode} 
          onAddTask={handleTaskSubmit} 
          className="mr-1 !bg-blue-500/90 hover:!bg-blue-600/90 h-9 sm:h-9"
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </Button>

        {onOpenAuth && !isLoggedIn && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onOpenAuth}
            className="flex items-center gap-2"
          >
            <LogIn size={16} />
            Login
          </Button>
        )}

        {loading ? null : <AuthSection user={user} />}
        
        <TaskCreationSheet 
          isOpen={isTaskSheetOpen}
          onClose={handleSheetOpenChange}
          onSubmit={handleTaskSubmit}
        />
      </div>
    </header>
  );
};

export default TaskAppHeader;
