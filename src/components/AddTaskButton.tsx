
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddTaskButtonProps {
  darkMode: boolean;
}

const AddTaskButton = ({ darkMode }: AddTaskButtonProps) => {
  return (
    <button className={cn(
      "w-full py-3 rounded-xl flex items-center justify-center text-sm transition-all duration-300",
      darkMode 
        ? 'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20' 
        : 'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20'
    )}>
      <PlusCircle size={16} className="mr-2" />
      Add New Task
    </button>
  );
};

export default AddTaskButton;
