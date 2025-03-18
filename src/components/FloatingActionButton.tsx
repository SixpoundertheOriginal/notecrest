
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
        "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full",
        "flex items-center justify-center shadow-lg transition-all duration-200",
        "bg-gradient-to-br from-[#ea384c] to-[#ff7e54]",
        "hover:from-[#ff4c5f] hover:to-[#ff8f69] active:scale-95",
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
      {/* Custom glow effect */}
      <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(234,56,76,0.5)]"></div>
      
      {/* Inner ring */}
      <div className="absolute inset-1 rounded-full border border-white/20"></div>
      
      {/* Plus icon */}
      <Plus size={24} className="text-white relative z-10" />
      
      {/* Pulse animation */}
      <div className="absolute inset-0 rounded-full animate-pulse bg-white/5"></div>
    </button>
  );
};

export default FloatingActionButton;
