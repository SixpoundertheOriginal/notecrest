
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckSquare, ListTodo, StickyNote } from 'lucide-react';

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
          "flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all duration-300 min-h-[44px]",
          activeTab === 'tasks' 
            ? 'bg-white/10 text-blue-300 font-medium' 
            : 'text-gray-100 hover:text-white'
        )}
      >
        <ListTodo size={16} />
        Tasks
      </button>
      <button 
        onClick={() => setActiveTab('completed')} 
        className={cn(
          "flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all duration-300 min-h-[44px]",
          activeTab === 'completed' 
            ? 'bg-white/10 text-blue-300 font-medium' 
            : 'text-gray-100 hover:text-white'
        )}
      >
        <CheckSquare size={16} />
        Completed
      </button>
      <button 
        onClick={() => setActiveTab('notes')} 
        className={cn(
          "flex-1 py-3 px-4 flex items-center justify-center gap-2 transition-all duration-300 min-h-[44px]",
          activeTab === 'notes' 
            ? 'bg-white/10 text-blue-300 font-medium' 
            : 'text-gray-100 hover:text-white'
        )}
      >
        <StickyNote size={16} />
        Notes
      </button>
    </div>
  );
};

export default TaskAppTabs;
