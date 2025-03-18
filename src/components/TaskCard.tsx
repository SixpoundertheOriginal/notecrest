
import React from 'react';
import { Calendar, CheckCircle, ChevronDown, Square } from 'lucide-react';
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
  const { isMobile } = useIsMobile();
  
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
        "task-card relative rounded-md p-3 shadow-sm cursor-pointer transition-all duration-300 backdrop-blur-sm border-l-2 overflow-hidden",
        darkMode 
          ? 'hover:bg-gray-800/40 bg-[#1A1F2C]/60' 
          : 'hover:bg-white/80 bg-white/30',
        draggedTaskId === task.id ? 'opacity-50 scale-95' : 'opacity-100',
        task.completed 
          ? 'border-l-green-500/50' 
          : `border-l-${priorityColors.dot.replace('bg-', '')}`
      )}
    >
      {/* Cosmic decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient glow based on priority */}
        <div className={`absolute -right-6 -top-6 w-12 h-12 rounded-full bg-gradient-to-br ${
          task.priority === 'High' ? 'from-red-500/20 to-[#ea384c]/10' : 
          task.priority === 'Medium' ? 'from-yellow-500/20 to-amber-500/10' : 
          'from-blue-500/20 to-indigo-500/10'
        } blur-xl opacity-60`}></div>
        
        {/* Subtle cosmic dust */}
        <div className="absolute top-1/4 left-1/4 w-0.5 h-0.5 bg-white/60 rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/5 w-0.5 h-0.5 bg-white/70 rounded-full"></div>
        <div className="absolute top-2/3 right-1/3 w-0.5 h-0.5 bg-white/50 rounded-full"></div>
        
        {/* Border glow */}
        <div className="absolute inset-0 border border-white/5 rounded-md"></div>
        
        {/* Left border cosmic glow effect */}
        <div className={`absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b ${
          task.priority === 'High' ? 'from-red-500/0 via-red-500/30 to-red-500/0' : 
          task.priority === 'Medium' ? 'from-yellow-500/0 via-yellow-500/30 to-yellow-500/0' : 
          'from-blue-500/0 via-blue-500/30 to-blue-500/0'
        }`}></div>
      </div>
      
      <div className="flex justify-between items-start gap-2 relative z-10">
        <div className="flex items-start gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompletion(task.id);
            }}
            className="mt-0.5 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 -my-2"
            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.completed ? (
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse"></div>
                <CheckCircle size={16} className="text-emerald-500 relative z-10" />
              </div>
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
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex items-center backdrop-blur-sm ${
                task.priority === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {priorityColors.icon}
                {task.priority}
              </span>
              
              {task.date && (
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full flex items-center backdrop-blur-sm border border-white/10",
                  darkMode ? 'bg-gray-800/50' : 'bg-white/40'
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
          <div className="min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 -my-2">
            <div className="relative">
              <ChevronDown 
                size={14} 
                className={cn(
                  "transform transition-transform duration-300 text-muted-foreground",
                  task.expanded ? 'rotate-180' : ''
                )} 
              />
              {task.expanded && (
                <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {task.expanded && (
        <TaskDetails task={task} darkMode={darkMode} />
      )}
    </div>
  );
};

export default TaskCard;
