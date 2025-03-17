
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  className,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#ea384c] text-white",
        "flex items-center justify-center shadow-lg transition-all duration-200",
        "hover:bg-[#d92d40] active:scale-95 group",
        isPressed ? 'scale-[0.97]' : '',
        className
      )}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      aria-label="Add new task"
    >
      {/* Inner shadow and glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ef5667]/30 to-[#ea384c]/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Radial shine effect on hover */}
      <div className="absolute inset-0 rounded-full bg-radial-gradient from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Subtle inner glow */}
      <div className="absolute inset-0 rounded-full shadow-inner shadow-white/10" />
      
      <Plus size={24} className="text-white" />
    </button>
  );
};

export default FloatingActionButton;
