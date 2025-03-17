
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
  draggedTaskId: number | null;
  onDragStart: (e: React.DragEvent, id: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: number) => void;
  onToggleCompletion: (id: number) => void;
  onToggleExpansion: (id: number) => void;
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

  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, task.id)}
      onClick={() => onToggleExpansion(task.id)}
      className={cn(
        "task-card relative rounded-xl p-3 sm:p-4 shadow-sm cursor-pointer transition-all duration-300 glass-card",
        darkMode 
          ? 'hover:bg-gray-800/50' 
          : 'hover:bg-white',
        draggedTaskId === task.id ? 'opacity-50 scale-95' : 'opacity-100'
      )}
    >
      <div className={`priority-indicator ${priorityColors.dot}`}></div>
      
      {task.status === 'In Progress' && (
        <div className="status-pulse pulse-animation bg-amber-400"></div>
      )}
      
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompletion(task.id);
            }}
            className="mt-1 flex-shrink-0"
          >
            {task.completed ? (
              <CheckCircle size={isMobile ? 16 : 18} className="text-emerald-500" />
            ) : (
              <Square size={isMobile ? 16 : 18} className={darkMode ? 'text-gray-600' : 'text-gray-300'} />
            )}
          </button>
          
          <div>
            <h3 className={cn(
              "text-base font-display font-semibold mb-1 tracking-tight",
              task.completed ? 'line-through text-gray-500' : ''
            )}>
              {task.title}
            </h3>
            
            <div className="flex flex-wrap mt-1.5 sm:mt-2 gap-1.5 sm:gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${priorityColors.bg} text-white flex items-center`}>
                {priorityColors.icon}
                {task.priority}
              </span>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full flex items-center",
                darkMode ? 'bg-gray-800/70' : 'bg-gray-200/50'
              )}>
                {getStatusIcon(task.status)}
                {task.status}
              </span>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full flex items-center",
                darkMode ? 'bg-gray-800/70' : 'bg-gray-200/50'
              )}>
                <Calendar size={10} className="mr-1" />
                {task.date}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className={cn(
            "text-xs hidden sm:inline",
            darkMode ? 'text-gray-500' : 'text-gray-400'
          )}>
            <Clock size={10} className="inline mr-1" />
            42 min ago
          </span>
          <ChevronDown 
            size={isMobile ? 14 : 16} 
            className={cn(
              "transform transition-transform duration-300",
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
