
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
      "flex mb-6 rounded-2xl overflow-hidden glass-morphism",
      darkMode ? 'bg-gray-900/30' : 'bg-white/70'
    )}>
      <button 
        onClick={() => setActiveTab('tasks')} 
        className={cn(
          "flex-1 py-3 px-4 flex items-center justify-center transition-all duration-300",
          activeTab === 'tasks' 
            ? (darkMode ? 'bg-gray-800/50 text-primary' : 'bg-white text-primary') 
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
            ? (darkMode ? 'bg-gray-800/50 text-primary' : 'bg-white text-primary') 
            : ''
        )}
      >
        Notes
      </button>
    </div>
  );
};

export default TaskAppTabs;
