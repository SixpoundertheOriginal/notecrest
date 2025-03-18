
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
    <div className="fixed bottom-6 right-6 z-50">
      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded-full animate-pulse bg-[#ea384c]/20 scale-150 blur-xl"></div>
      
      {/* Button with enhanced UI */}
      <button
        onClick={onClick}
        className={cn(
          "relative w-16 h-16 rounded-full",
          "flex items-center justify-center shadow-lg transition-all duration-300",
          "bg-gradient-to-br from-[#ea384c] to-[#ff7e54]",
          "hover:from-[#ff4c5f] hover:to-[#ff8f69]",
          isPressed ? 'scale-95' : 'scale-100',
          className
        )}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        aria-label="Add new task"
      >
        {/* Circular border effect */}
        <div className="absolute inset-0 rounded-full border border-white/20 overflow-hidden">
          {/* Subtle radial reflections */}
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/70 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-0.5 h-0.5 bg-white/50 rounded-full"></div>
        </div>
        
        {/* Inner ring */}
        <div className="absolute inset-2 rounded-full border border-white/10"></div>
        
        {/* Plus icon with enhanced appearance */}
        <Plus size={28} className="text-white relative z-10" strokeWidth={2.5} />
        
        {/* Inner glow effect */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_15px_rgba(255,255,255,0.2)]"></div>
      </button>
    </div>
  );
};

export default FloatingActionButton;
