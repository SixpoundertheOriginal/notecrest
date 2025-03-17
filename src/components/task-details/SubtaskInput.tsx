
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface SubtaskInputProps {
  onAddSubtask: (title: string) => void;
  darkMode: boolean;
}

const SubtaskInput = ({ onAddSubtask, darkMode }: SubtaskInputProps) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    
    onAddSubtask(newSubtaskTitle);
    setNewSubtaskTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={newSubtaskTitle}
        onChange={(e) => setNewSubtaskTitle(e.target.value)}
        placeholder="Add a subtask..."
        className={cn(
          "w-full px-3 py-2 rounded-lg text-xs transition-all duration-200 min-h-[44px]",
          darkMode 
            ? 'bg-gray-800/50 border border-gray-700 focus:border-primary text-white placeholder-gray-600' 
            : 'bg-white border border-gray-300 focus:border-primary placeholder-gray-400'
        )}
      />
    </form>
  );
};

export default SubtaskInput;
