
import React from 'react';
import { cn } from '@/lib/utils';

interface TaskAppTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
}

const TaskAppTabs = ({ activeTab, setActiveTab, darkMode }: TaskAppTabsProps) => {
  return (
    <div className="glass-morphism flex mb-6 rounded-lg overflow-hidden">
      <button 
        onClick={() => setActiveTab('tasks')} 
        className={cn(
          "flex-1 py-3 px-4 flex items-center justify-center transition-all duration-300",
          activeTab === 'tasks' 
            ? 'bg-white/10 text-blue-400' 
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
            ? 'bg-white/10 text-blue-400' 
            : ''
        )}
      >
        Notes
      </button>
    </div>
  );
};

export default TaskAppTabs;
