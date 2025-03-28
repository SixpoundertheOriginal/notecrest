import React from 'react';
import { TaskData } from '@/types/task';
import TaskCard from './TaskCard';
import { Loader2, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface CompletedTasksViewProps {
  darkMode: boolean;
  tasks: TaskData[];
  isLoading?: boolean;
  draggedTaskId: number | string | null;
  onDragStart: (e: React.DragEvent, id: number | string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: number | string) => void;
  onToggleCompletion: (id: number | string) => void;
  onToggleExpansion: (id: number | string) => void;
  onUpdateTask: (task: TaskData) => Promise<boolean>;
  onClearCompletedTasks?: () => void;
}

const CompletedTasksView = ({
  darkMode,
  tasks,
  isLoading = false,
  draggedTaskId,
  onDragStart,
  onDragOver,
  onDrop,
  onToggleCompletion,
  onToggleExpansion,
  onUpdateTask,
  onClearCompletedTasks,
}: CompletedTasksViewProps) => {
  const isMobile = useIsMobile();
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="glass-morphism rounded-lg overflow-hidden shadow-sm">
      <div className="p-3 flex justify-between items-center border-b border-white/5">
        <h3 className="text-sm font-medium">
          Completed ({completedTasks.length})
        </h3>
        
        {completedTasks.length > 0 && onClearCompletedTasks && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCompletedTasks}
            className={cn(
              "h-7 px-2 text-xs",
              darkMode ? "hover:bg-red-900/10 text-red-400" : "hover:bg-red-100/50 text-red-500"
            )}
          >
            <Trash2 size={12} className="mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 min-h-[150px] max-h-[60vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-5 w-5 animate-spin text-primary/70" />
          </div>
        ) : completedTasks.length > 0 ? (
          completedTasks.map((task, index) => (
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
              {index < completedTasks.length - 1 && (
                <div className={cn(
                  "h-px w-full",
                  darkMode ? "bg-white/5" : "bg-black/5"
                )} />
              )}
            </React.Fragment>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-muted-foreground text-sm">No completed tasks</p>
            <p className="text-xs text-muted-foreground mt-1">
              Complete tasks will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedTasksView;
