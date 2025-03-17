
import React from 'react';
import { cn } from '@/lib/utils';

interface NotesViewProps {
  darkMode: boolean;
}

const NotesView = ({ darkMode }: NotesViewProps) => {
  return (
    <div className={cn(
      "p-6 rounded-lg glass-morphism flex flex-col justify-center items-center",
      darkMode ? 'bg-[#1A1F2C]/70' : 'bg-white/70'
    )}>
      <h3 className="text-lg font-display mb-2 text-gradient">Notes</h3>
      <p className="text-sm font-sans text-gray-400">Notes content would appear here</p>
    </div>
  );
};

export default NotesView;
