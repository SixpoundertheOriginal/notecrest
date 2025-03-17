
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
      className="glass-button-primary w-full py-3 rounded-lg flex items-center justify-center text-sm font-medium"
    >
      <PlusCircle size={16} className="mr-2" />
      Add New Task
    </button>
  );
};

export default AddTaskButton;
