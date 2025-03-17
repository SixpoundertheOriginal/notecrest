
import React from 'react';
import { cn } from '@/lib/utils';

interface TaskAppTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
}

const TaskAppTabs = ({ activeTab, setActiveTab, darkMode }: TaskAppTabsProps) => {
  return (
    <div className={cn(
      "flex mb-6 rounded-lg overflow-hidden glass-morphism",
      darkMode ? 'bg-[#1A1F2C]/70' : 'bg-white/70'
    )}>
      <button 
        onClick={() => setActiveTab('tasks')} 
        className={cn(
          "flex-1 py-3 px-4 flex items-center justify-center transition-all duration-300",
          activeTab === 'tasks' 
            ? (darkMode ? 'bg-[#2D3343] text-blue-400' : 'bg-white text-primary') 
            : ''
        )}
      >
        Tasks
      </button>
      <button 
        onClick={() => setActiveTab('notes')} 
        className={cn(
          "flex-1 py-3 px-4 flex items-center justify-center transition-all duration-300",
          activeTab === 'notes' 
            ? (darkMode ? 'bg-[#2D3343] text-blue-400' : 'bg-white text-primary') 
            : ''
        )}
      >
        Notes
      </button>
    </div>
  );
};

export default TaskAppTabs;
