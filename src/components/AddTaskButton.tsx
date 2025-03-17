
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobileValue } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import TaskCreationSheet from './TaskCreationSheet';

interface AddTaskButtonProps {
  darkMode: boolean;
  onAddTask: (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => void;
  className?: string;
}

const AddTaskButton = ({ darkMode, onAddTask, className }: AddTaskButtonProps) => {
  const isMobile = useIsMobileValue();
  const [isPressed, setIsPressed] = useState(false);
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    // Critical: prevent default behavior completely
    e.preventDefault();
    e.stopPropagation();
    
    console.log('AddTaskButton: Click detected, setting sheet to open');
    setIsTaskSheetOpen(true);
  };
  
  const handleTaskSubmit = (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => {
    console.log('AddTaskButton: Task submitted', task);
    onAddTask(task);
    setIsTaskSheetOpen(false);
  };
  
  const handleSheetClose = (open: boolean) => {
    console.log('AddTaskButton: Sheet state changing to:', open);
    setIsTaskSheetOpen(open);
  };
  
  return (
    <>
      <Button 
        onClick={handleClick}
        className={cn(
          "bg-blue-500/90 hover:bg-blue-600/90 text-white rounded-lg transition-all duration-200 group relative overflow-hidden",
          isPressed ? 'scale-[0.98]' : '',
          isMobile ? "px-2.5 py-1.5 text-sm" : "px-3 py-2",
          className
        )}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
      >
        {/* Star-like gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-indigo-400/20 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Radial shine effect on hover */}
        <div className="absolute inset-0 bg-radial-gradient from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Subtle inner glow */}
        <div className="absolute inset-0 shadow-inner shadow-blue-300/20" />
        
        {/* Subtle star-like shine in corners */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-80 transition-opacity" />
        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-white/30 rounded-full opacity-0 group-hover:opacity-70 transition-opacity" />
        
        <Plus size={isMobile ? 16 : 18} className="mr-1" />
        <span className="whitespace-nowrap">{isMobile ? "New Task" : "Create Task"}</span>
      </Button>

      <TaskCreationSheet 
        isOpen={isTaskSheetOpen}
        onClose={handleSheetClose}
        onSubmit={handleTaskSubmit}
      />
    </>
  );
};

export default AddTaskButton;
