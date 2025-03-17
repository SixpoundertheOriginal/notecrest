
import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

interface AddTaskButtonProps {
  darkMode: boolean;
  onClick: () => void;
}

const AddTaskButton = ({ darkMode, onClick }: AddTaskButtonProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Button 
      onClick={onClick}
      className="w-full bg-blue-500/90 hover:bg-blue-600/90 text-white py-2.5 sm:py-3 rounded-lg transition-all duration-200 group relative overflow-hidden"
    >
      {/* Add subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Add subtle inner shadow for depth */}
      <div className="absolute inset-0 shadow-inner shadow-blue-300/10" />
      
      <Plus size={isMobile ? 16 : 18} className="mr-2" />
      <span>Add New Task</span>
    </Button>
  );
};

export default AddTaskButton;
