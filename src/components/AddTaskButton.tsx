
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface AddTaskButtonProps {
  darkMode: boolean;
  onClick: () => void;
}

const AddTaskButton = ({ darkMode, onClick }: AddTaskButtonProps) => {
  const isMobile = useIsMobile();
  
  return (
    <button 
      onClick={onClick}
      className="glass-button-primary w-full py-2.5 sm:py-3 rounded-lg flex items-center justify-center font-medium"
    >
      <PlusCircle size={isMobile ? 14 : 16} className="mr-2" />
      Add New Task
    </button>
  );
};

export default AddTaskButton;
