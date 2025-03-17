
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TaskData } from '@/types/task';
import TaskFilters from './TaskFilters';
import TaskCard from './TaskCard';
import TaskCreationSheet from './TaskCreationSheet';
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
  const isMobile = useIsMobile();
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
  
  const handleTaskSubmit = (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => {
    if (!task.title) {
      setIsTaskSheetOpen(true);
      return;
    }
    onAddTask(task);
    setIsTaskSheetOpen(false);
  };

  return (
    <div className="glass-morphism rounded-xl overflow-hidden">
      <div className={cn(
        "p-3 sm:p-4 flex", 
        isMobile ? "flex-col space-y-2" : "flex-wrap gap-2"
      )}>
        <TaskFilters darkMode={darkMode} />
      </div>

      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        <SmartTaskInput 
          onCreateTask={handleTaskSubmit}
          darkMode={darkMode}
        />
        
        {!isLoggedIn && (
          <div className="mt-2 text-center text-xs text-amber-500">
            Note: Tasks are stored locally. Login to save your tasks.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 p-3 sm:p-4 min-h-[200px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-muted-foreground mb-2">No active tasks found</p>
            <p className="text-sm text-muted-foreground">
              Use the text field above to create your first task
            </p>
          </div>
        )}
      </div>

      <TaskCreationSheet 
        isOpen={isTaskSheetOpen}
        onClose={() => setIsTaskSheetOpen(false)}
        onSubmit={(task) => {
          onAddTask(task);
          setIsTaskSheetOpen(false);
        }}
      />
    </div>
  );
};

export default TasksView;
