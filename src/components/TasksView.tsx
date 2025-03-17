
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TaskData } from '@/types/task';
import TaskFilters from './TaskFilters';
import TaskCard from './TaskCard';
import SmartTaskInput from './SmartTaskInput';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2 } from 'lucide-react';

interface TasksViewProps {
  darkMode: boolean;
  tasks: TaskData[];
  isLoading?: boolean;
  draggedTaskId: number | string | null;
  onDragStart: (e: React.DragEvent, id: number | string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: number | string) => void;
  onToggleCompletion: (id: number | string) => void;
  onToggleExpansion: (id: number | string) => void;
  onAddTask: (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => void;
  isLoggedIn?: boolean;
}

const TasksView = ({
  darkMode,
  tasks,
  isLoading = false,
  draggedTaskId,
  onDragStart,
  onDragOver,
  onDrop,
  onToggleCompletion,
  onToggleExpansion,
  onAddTask,
  isLoggedIn = false,
}: TasksViewProps) => {
  const { isMobile } = useIsMobile();
  
  return (
    <div className="glass-morphism rounded-lg overflow-hidden shadow-sm">
      <div className="p-3 space-y-2">
        <TaskFilters darkMode={darkMode} />
        
        {/* Smart NLP Task Input */}
        <SmartTaskInput 
          onCreateTask={onAddTask}
          darkMode={darkMode}
        />
        
        {!isLoggedIn && (
          <div className="text-center text-xs text-amber-400/80 opacity-80">
            Tasks stored locally. Login to save.
          </div>
        )}
      </div>

      <div className="border-t border-white/5">
        <div className={cn(
          "grid grid-cols-1 gap-2 p-3 min-h-[180px] overflow-y-auto",
          isMobile ? "max-h-[calc(100vh-280px)]" : "max-h-[60vh]"
        )}>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-5 w-5 animate-spin text-primary/70" />
            </div>
          ) : tasks.length > 0 ? (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                darkMode={darkMode}
                draggedTaskId={draggedTaskId}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onToggleCompletion={onToggleCompletion}
                onToggleExpansion={onToggleExpansion}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <p className="text-muted-foreground text-sm">No active tasks</p>
              <p className="text-xs text-muted-foreground mt-1">
                Enter text above to create a task
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksView;
