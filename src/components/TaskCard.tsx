import React, { useMemo } from 'react';
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
  onUpdateTask?: (updatedTask: TaskData) => Promise<boolean>;
}

const TaskCard = ({
  task,
  darkMode = false,
  draggedTaskId,
  onDragStart,
  onDragOver,
  onDrop,
  onToggleCompletion,
  onToggleExpansion,
  onUpdateTask
}: TaskCardProps) => {
  const priorityColors = getPriorityColor(task.priority);
  const { isMobile } = useIsMobile();
  
  const relativeTime = useMemo(() => {
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
  }, [task.createdAt]);

  const taskCardClasses = useMemo(() => {
    return cn(
      "task-card relative rounded-md p-3 shadow-sm cursor-pointer transition-all duration-300 backdrop-blur-sm border-l-2 overflow-hidden",
      darkMode 
        ? 'hover:bg-gray-800/40 bg-[#1A1F2C]/60' 
        : 'hover:bg-white/80 bg-white/30',
      draggedTaskId === task.id ? 'opacity-50 scale-95' : 'opacity-100',
      task.completed 
        ? 'border-l-green-500/50' 
        : `border-l-${priorityColors.dot.replace('bg-', '')}`
    );
  }, [darkMode, draggedTaskId, task.id, task.completed, priorityColors.dot]);

  const handleCompletionToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleCompletion(task.id);
  };

  const handleExpansionToggle = () => {
    onToggleExpansion(task.id);
  };

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, task.id)}
      onClick={handleExpansionToggle}
      className={taskCardClasses}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -right-6 -top-6 w-12 h-12 rounded-full bg-gradient-to-br ${
          task.priority === 'High' ? 'from-[#D946EF]/20 to-[#F97316]/10' : 
          task.priority === 'Medium' ? 'from-[#8B5CF6]/20 to-[#6366F1]/10' : 
          'from-[#0EA5E9]/20 to-[#38BDF8]/10'
        } blur-xl opacity-60`}></div>
        
        <div className="absolute top-1/4 left-1/4 w-0.5 h-0.5 bg-white/60 rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/5 w-0.5 h-0.5 bg-white/70 rounded-full"></div>
        <div className="absolute top-2/3 right-1/3 w-0.5 h-0.5 bg-white/50 rounded-full"></div>
        
        <div className="absolute inset-0 border border-white/5 rounded-md"></div>
        
        <div className={`absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b ${
          task.priority === 'High' ? 'from-[#D946EF]/0 via-[#D946EF]/30 to-[#D946EF]/0' : 
          task.priority === 'Medium' ? 'from-[#8B5CF6]/0 via-[#8B5CF6]/30 to-[#8B5CF6]/0' : 
          'from-[#0EA5E9]/0 via-[#0EA5E9]/30 to-[#0EA5E9]/0'
        }`}></div>
      </div>
      
      <div className="flex justify-between items-start gap-2 relative z-10">
        <div className="flex items-start gap-2">
          <button 
            onClick={handleCompletionToggle}
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
                task.priority === 'High' ? 'bg-[#D946EF]/20 text-[#D946EF] border border-[#D946EF]/30' : 
                task.priority === 'Medium' ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30' : 
                'bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30'
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
            {relativeTime}
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
        <TaskDetails
          task={task}
          darkMode={darkMode}
          onTaskUpdate={onUpdateTask}
          onClose={() => onToggleExpansion(task.id)}
        />
      )}
    </div>
  );
};

export default React.memo(TaskCard);
