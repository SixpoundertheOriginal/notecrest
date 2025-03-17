
import React from 'react';
import { cn } from '@/lib/utils';

interface NotesViewProps {
  darkMode: boolean;
}

const NotesView = ({ darkMode }: NotesViewProps) => {
  return (
    <div className={cn(
      "p-6 rounded-2xl glass-morphism flex justify-center items-center",
      darkMode ? 'bg-gray-900/30' : 'bg-white/70'
    )}>
      <p className="text-sm">Notes content would appear here</p>
    </div>
  );
};

export default NotesView;
