
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
  
  const handleClick = () => {
    setIsTaskSheetOpen(true);
  };
  
  return (
    <>
      <Button 
        onClick={handleClick}
        className={cn(
          "w-full bg-blue-500/90 hover:bg-blue-600/90 text-white py-2.5 sm:py-3 rounded-lg transition-all duration-200 group relative overflow-hidden",
          isPressed ? 'scale-[0.98]' : '',
          className
        )}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
      >
        {/* Add subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Add subtle inner shadow for depth */}
        <div className="absolute inset-0 shadow-inner shadow-blue-300/10" />
        
        <Plus size={isMobile ? 16 : 18} className="mr-2" />
        <span>Create Detailed Task</span>
      </Button>

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
};

export default AddTaskButton;
