
import React from 'react';
import { cn } from '@/lib/utils';

interface NotesViewProps {
  darkMode: boolean;
}

const NotesView = ({ darkMode }: NotesViewProps) => {
  return (
    <div className="glass-morphism p-6 rounded-xl flex flex-col justify-center items-center">
      <h3 className="text-xl font-display font-semibold mb-3 text-gradient">Notes</h3>
      <p className="text-sm font-sans text-gray-400">Notes content would appear here</p>
    </div>
  );
};

export default NotesView;
