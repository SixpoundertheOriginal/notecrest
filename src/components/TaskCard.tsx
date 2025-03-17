
import React from 'react';
import { Calendar, CheckCircle, ChevronDown, Clock, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskData } from '@/types/task';
import { getPriorityColor, getStatusIcon } from '@/lib/taskUtils';
import TaskDetails from './TaskDetails';
import { useIsMobile } from '@/hooks/use-mobile';

interface TaskCardProps {
  task: TaskData;
  darkMode: boolean;
  draggedTaskId: number | string | null;
  onDragStart: (e: React.DragEvent, id: number | string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: number | string) => void;
  onToggleCompletion: (id: number | string) => void;
  onToggleExpansion: (id: number | string) => void;
}

const TaskCard = ({
  task,
  darkMode,
  draggedTaskId,
  onDragStart,
  onDragOver,
  onDrop,
  onToggleCompletion,
  onToggleExpansion,
}: TaskCardProps) => {
  const priorityColors = getPriorityColor(task.priority);
  const isMobile = useIsMobile();
  
  // Calculate relative time
  const getRelativeTime = () => {
    const now = new Date();
    const taskDate = new Date(task.createdAt || now);
    
    const diffInMinutes = Math.floor((now.getTime() - taskDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  };

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, task.id)}
      onClick={() => onToggleExpansion(task.id)}
      className={cn(
        "task-card relative rounded-md p-2 shadow-sm cursor-pointer transition-all duration-200 bg-background/30 border-l-2",
        darkMode 
          ? 'hover:bg-gray-800/30' 
          : 'hover:bg-white/80',
        draggedTaskId === task.id ? 'opacity-50 scale-95' : 'opacity-100',
        task.completed 
          ? 'border-l-green-500/50' 
          : `border-l-${priorityColors.dot.replace('bg-', '')}`
      )}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-start gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompletion(task.id);
            }}
            className="mt-0.5 flex-shrink-0"
            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.completed ? (
              <CheckCircle size={16} className="text-emerald-500" />
            ) : (
              <Square size={16} className={darkMode ? 'text-gray-600' : 'text-gray-300'} />
            )}
          </button>
          
          <div>
            <h3 className={cn(
              "text-sm font-medium tracking-tight",
              task.completed ? 'line-through text-muted-foreground' : ''
            )}>
              {task.title}
            </h3>
            
            <div className="flex flex-wrap mt-1 gap-1">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex items-center ${
                task.priority === 'High' ? 'bg-red-500/15 text-red-400' : 
                task.priority === 'Medium' ? 'bg-yellow-500/15 text-yellow-400' : 
                'bg-blue-500/15 text-blue-400'
              }`}>
                {priorityColors.icon}
                {task.priority}
              </span>
              
              {task.date && (
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full flex items-center",
                  darkMode ? 'bg-gray-800/50' : 'bg-gray-200/70'
                )}>
                  <Calendar size={8} className="mr-1" />
                  {task.date}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground hidden sm:inline-block">
            {getRelativeTime()}
          </span>
          <ChevronDown 
            size={14} 
            className={cn(
              "transform transition-transform duration-300 text-muted-foreground",
              task.expanded ? 'rotate-180' : ''
            )} 
          />
        </div>
      </div>
      
      {task.expanded && (
        <TaskDetails task={task} darkMode={darkMode} />
      )}
    </div>
  );
};

export default TaskCard;
