
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
  onClearCompletedTasks,
}: CompletedTasksViewProps) => {
  const isMobile = useIsMobile();
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="glass-morphism rounded-xl overflow-hidden">
      <div className="p-3 sm:p-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Completed Tasks ({completedTasks.length})
        </h3>
        
        {completedTasks.length > 0 && onClearCompletedTasks && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearCompletedTasks}
            className={cn(
              "flex items-center gap-1",
              darkMode ? "hover:bg-red-900/20" : "hover:bg-red-100"
            )}
          >
            <Trash2 size={14} className="text-red-500" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 p-3 sm:p-4 min-h-[200px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : completedTasks.length > 0 ? (
          completedTasks.map((task) => (
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
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-muted-foreground mb-2">No completed tasks</p>
            <p className="text-sm text-muted-foreground">
              Complete tasks to see them here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedTasksView;
