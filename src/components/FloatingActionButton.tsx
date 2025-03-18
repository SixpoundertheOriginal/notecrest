
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
      {/* Enhanced cosmic glow effect */}
      <div className="absolute inset-0 rounded-full animate-pulse bg-[#ea384c]/30 scale-150 blur-xl"></div>
      <div className="absolute inset-0 rounded-full animate-pulse bg-[#3d85c6]/20 scale-[1.8] blur-xl" 
           style={{animationDelay: '0.5s', animationDuration: '3s'}}></div>
      
      {/* Button with enhanced cosmic UI */}
      <button
        onClick={onClick}
        className={cn(
          "relative w-16 h-16 rounded-full",
          "flex items-center justify-center shadow-lg transition-all duration-300",
          "bg-gradient-to-br from-[#ea384c] to-[#ff7e54]",
          "hover:from-[#ff4c5f] hover:to-[#ff8f69]",
          isPressed ? 'scale-95' : 'scale-100',
          "cosmic-pulse", // New class for the cosmic pulse effect
          className
        )}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        aria-label="Add new task"
      >
        {/* Cosmic border effect */}
        <div className="absolute inset-0 rounded-full border border-white/20 overflow-hidden">
          {/* Subtle cosmic dust particles */}
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/70 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-0.5 h-0.5 bg-white/50 rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-0.75 h-0.75 bg-[#61dafb]/50 rounded-full"></div>
        </div>
        
        {/* Inner ring with cosmic glow */}
        <div className="absolute inset-2 rounded-full border border-white/10 shadow-[inset_0_0_10px_rgba(234,56,76,0.3)]"></div>
        
        {/* Plus icon with enhanced appearance */}
        <Plus size={28} className="text-white relative z-10" strokeWidth={2.5} />
        
        {/* Inner cosmic glow effect */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_15px_rgba(255,255,255,0.2)]"></div>
      </button>
    </div>
  );
};

export default FloatingActionButton;
