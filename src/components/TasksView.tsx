
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TaskData } from '@/types/task';
import TaskSearchBar from './TaskSearchBar';
import TaskFilters from './TaskFilters';
import AddTaskButton from './AddTaskButton';
import TaskCard from './TaskCard';
import TaskCreationSheet from './TaskCreationSheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

interface TasksViewProps {
  darkMode: boolean;
  tasks: TaskData[];
  draggedTaskId: number | null;
  onDragStart: (e: React.DragEvent, id: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: number) => void;
  onToggleCompletion: (id: number) => void;
  onToggleExpansion: (id: number) => void;
  onAddTask: (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => void;
}

const TasksView = ({
  darkMode,
  tasks,
  draggedTaskId,
  onDragStart,
  onDragOver,
  onDrop,
  onToggleCompletion,
  onToggleExpansion,
  onAddTask,
}: TasksViewProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);
  
  const handleTaskSubmit = (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => {
    console.log('New task created:', task);
    onAddTask(task); // Pass the actual task data to parent
    setIsTaskSheetOpen(false);
    toast({
      title: "Success",
      description: "Task created successfully",
    });
  };

  return (
    <div className="glass-morphism rounded-xl overflow-hidden">
      <div className={cn(
        "p-3 sm:p-4 flex", 
        isMobile ? "flex-col space-y-2" : "flex-wrap gap-2"
      )}>
        <TaskSearchBar darkMode={darkMode} />
        <TaskFilters darkMode={darkMode} />
      </div>

      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        <AddTaskButton 
          darkMode={darkMode} 
          onClick={() => setIsTaskSheetOpen(true)} 
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 p-3 sm:p-4">
        {tasks.map((task) => (
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
        ))}
      </div>

      <TaskCreationSheet 
        isOpen={isTaskSheetOpen}
        onClose={() => setIsTaskSheetOpen(false)}
        onSubmit={handleTaskSubmit}
      />
    </div>
  );
};

export default TasksView;
