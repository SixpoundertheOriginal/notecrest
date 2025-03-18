
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
    <div className="space-themed-glass relative overflow-hidden shadow-lg rounded-2xl border border-white/10 bg-[#1A1F2C]/90 backdrop-blur-xl">
      {/* Red/Orange circular gradient in the background */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-[#ea384c] to-[#ff7e54] opacity-20 blur-2xl -translate-y-1/2 translate-x-1/4"></div>
      
      <div className="p-3 space-y-2 relative z-10">
        <TaskFilters darkMode={darkMode} />
        
        {!isLoggedIn && (
          <div className="text-center text-xs text-amber-400/80 opacity-80">
            Tasks stored locally. Login to save.
          </div>
        )}
      </div>

      <div className="border-t border-white/5 relative z-10">
        <div className={cn(
          "grid grid-cols-1 gap-3 p-4 min-h-[180px] overflow-y-auto",
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
                    "h-px w-full",
                    darkMode ? "bg-white/5" : "bg-black/5"
                  )} />
                )}
              </React.Fragment>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-[#ea384c] to-[#ff7e54] opacity-30"></div>
              <p className="text-muted-foreground text-sm">No active tasks</p>
              <p className="text-xs text-muted-foreground mt-1">
                Use the + button to create a task
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Additional decorative element inspired by the image */}
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#ea384c]/10 to-[#ff7e54]/10 blur-xl rounded-full -translate-x-1/2 translate-y-1/2"></div>
    </div>
  );
};

export default TasksView;
