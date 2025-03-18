
import React from 'react';
import { cn } from '@/lib/utils';
import { TaskData } from '@/types/task';
import TaskFilters from './TaskFilters';
import TaskCard from './TaskCard';
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
  sortOption?: string;
  onSortChange?: (value: string) => void;
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
  sortOption = "date-desc",
  onSortChange
}: TasksViewProps) => {
  const { isMobile } = useIsMobile();
  
  return (
    <div className="space-themed-glass relative overflow-hidden shadow-lg rounded-2xl border border-white/10 bg-[#1A1F2C]/80 backdrop-blur-xl cosmic-background">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 z-0" 
           style={{ backgroundImage: 'url("/lovable-uploads/8ecf6916-e9ea-443f-a269-2ab79f920208.png")' }}>
      </div>
      
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gradient-to-br from-[#ea384c] to-[#ff7e54] opacity-5 blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-[#1e66de]/10 blur-2xl"></div>
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[20%] w-0.5 h-0.5 bg-white/70 rounded-full"></div>
        <div className="absolute top-[15%] left-[35%] w-1 h-1 bg-white/40 rounded-full"></div>
        <div className="absolute top-[45%] left-[78%] w-0.5 h-0.5 bg-white/50 rounded-full"></div>
        <div className="absolute top-[65%] left-[15%] w-1 h-1 bg-white/30 rounded-full"></div>
        <div className="absolute top-[85%] left-[60%] w-0.5 h-0.5 bg-white/60 rounded-full"></div>
      </div>
      
      <div className="p-3 space-y-2 relative z-10">
        <TaskFilters 
          darkMode={darkMode} 
          value={sortOption} 
          onSortChange={onSortChange} 
        />
        
        {!isLoggedIn && (
          <div className="text-center text-xs text-amber-400/80 opacity-80">
            Tasks stored locally. Login to save.
          </div>
        )}
      </div>

      <div className="border-t border-white/5 relative z-10">
        <div className={cn(
          "grid grid-cols-1 gap-4 p-4 min-h-[180px] overflow-y-auto",
          isMobile ? "max-h-[calc(100vh-280px)]" : "max-h-[60vh]"
        )}>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-5 w-5 animate-spin text-[#ea384c]" />
            </div>
          ) : tasks.length > 0 ? (
            tasks.map((task, index) => (
              <React.Fragment key={task.id}>
                <TaskCard
                  task={task}
                  darkMode={darkMode}
                  draggedTaskId={draggedTaskId}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onToggleCompletion={onToggleCompletion}
                  onToggleExpansion={onToggleExpansion}
                />
                {index < tasks.length - 1 && (
                  <div className={cn(
                    "h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  )} />
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-[#ea384c] to-[#ff7e54] opacity-20 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#1A1F2C]/90 flex items-center justify-center">
                  <div className="w-1 h-1 bg-white/70 rounded-full"></div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">No active tasks</p>
              <p className="text-xs text-muted-foreground mt-1">
                Use the + button to create a task
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#1A1F2C]/80 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default TasksView;
