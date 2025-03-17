
import React from 'react';
import { cn } from '@/lib/utils';
import { TaskData } from '@/types/task';
import TaskSearchBar from './TaskSearchBar';
import TaskFilters from './TaskFilters';
import AddTaskButton from './AddTaskButton';
import TaskCard from './TaskCard';

interface TasksViewProps {
  darkMode: boolean;
  tasks: TaskData[];
  draggedTaskId: number | null;
  onDragStart: (e: React.DragEvent, id: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: number) => void;
  onToggleCompletion: (id: number) => void;
  onToggleExpansion: (id: number) => void;
  onAddTask: () => void;
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
  return (
    <div className="glass-morphism rounded-xl overflow-hidden">
      <div className="p-4 flex flex-wrap gap-2">
        <TaskSearchBar darkMode={darkMode} />
        <TaskFilters darkMode={darkMode} />
      </div>

      <div className="px-4 pb-4">
        <AddTaskButton darkMode={darkMode} onClick={onAddTask} />
      </div>

      <div className="grid grid-cols-1 gap-4 p-4">
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
    </div>
  );
};

export default TasksView;
