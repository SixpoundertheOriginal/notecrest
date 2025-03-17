
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddTaskButtonProps {
  darkMode: boolean;
  onClick: () => void;
}

const AddTaskButton = ({ darkMode, onClick }: AddTaskButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full py-3 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300",
        darkMode 
          ? 'bg-[#2D3343] hover:bg-[#353D52] text-blue-400 border border-blue-500/20' 
          : 'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20'
      )}
    >
      <PlusCircle size={16} className="mr-2" />
      Add New Task
    </button>
  );
};

export default AddTaskButton;
