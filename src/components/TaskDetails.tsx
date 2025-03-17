
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskData } from '@/types/task';
import { getStatusIcon } from '@/lib/taskUtils';

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskDetailsProps {
  task: TaskData;
  darkMode: boolean;
}

const TaskDetails = ({ task, darkMode }: TaskDetailsProps) => {
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    
    const newSubtask: SubTask = {
      id: `subtask-${Date.now()}`,
      title: newSubtaskTitle,
      completed: false
    };
    
    setSubtasks([...subtasks, newSubtask]);
    setNewSubtaskTitle('');
  };

  const toggleSubtaskCompletion = (id: string) => {
    setSubtasks(subtasks.map(subtask => 
      subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
    ));
  };

  const deleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
  };

  return (
    <div 
      className={cn(
        "mt-4 p-4 rounded-xl text-sm transition-all duration-300 origin-top animate-expand overflow-hidden",
        darkMode 
          ? 'bg-gray-900/80 border border-gray-800/70' 
          : 'bg-white/90 border border-gray-200/80'
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-medium text-base">Task Details</h3>
        <div className="flex space-x-1">
          <button
            className={cn(
              "p-1 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center",
              darkMode
                ? 'hover:bg-gray-800 text-gray-300 hover:text-gray-100'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          </button>
          <button
            className={cn(
              "p-1 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center",
              darkMode
                ? 'hover:bg-gray-800 text-gray-300 hover:text-gray-100'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
          </button>
        </div>
      </div>
      
      {/* Form fields */}
      <div className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className={cn("block text-xs mb-1", darkMode ? 'text-gray-300' : 'text-gray-600')}>
              Title
            </label>
            <input 
              type="text" 
              defaultValue={task.title}
              className={cn(
                "w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 min-h-[44px]",
                darkMode 
                  ? 'bg-gray-800/70 border border-gray-700 focus:border-primary text-white' 
                  : 'bg-white border border-gray-300 focus:border-primary text-gray-800'
              )}
            />
          </div>
          
          <div>
            <label className={cn("block text-xs mb-1", darkMode ? 'text-gray-300' : 'text-gray-600')}>
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Add a description..."
              className={cn(
                "w-full px-3 py-2 rounded-lg text-sm transition-all duration-200 min-h-[44px]",
                darkMode 
                  ? 'bg-gray-800/70 border border-gray-700 focus:border-primary text-white placeholder-gray-500' 
                  : 'bg-white border border-gray-300 focus:border-primary text-gray-800 placeholder-gray-500'
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={cn("block text-xs mb-1", darkMode ? 'text-gray-300' : 'text-gray-600')}>
              Due Date
            </label>
            <div className={cn(
              "flex items-center px-3 py-2 rounded-lg text-sm min-h-[44px]",
              darkMode 
                ? 'bg-gray-800/50 border border-gray-700 focus-within:border-primary' 
                : 'bg-white border border-gray-300 focus-within:border-primary'
            )}>
              <Calendar size={14} className="mr-2 text-gray-500" />
              <input 
                type="date" 
                defaultValue="2025-03-08"
                className="bg-transparent focus:outline-none w-full"
              />
            </div>
          </div>
          
          <div>
            <label className={cn("block text-xs mb-1", darkMode ? 'text-gray-300' : 'text-gray-600')}>
              Priority
            </label>
            <select
              defaultValue={task.priority}
              className={cn(
                "w-full px-3 py-2 rounded-lg text-sm appearance-none transition-all duration-200 min-h-[44px]",
                darkMode 
                  ? 'bg-gray-800/50 border border-gray-700 focus:border-primary text-white' 
                  : 'bg-white border border-gray-300 focus:border-primary'
              )}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div>
          <label className={cn("block text-xs mb-1", darkMode ? 'text-gray-300' : 'text-gray-600')}>
            Status
          </label>
          <div className="flex space-x-4 mb-2">
            {['Todo', 'In Progress', 'Completed'].map((status) => (
              <div key={status} className="flex items-center">
                {getStatusIcon(status)}
                <span className="text-xs">{status}</span>
              </div>
            ))}
          </div>
          <select
            defaultValue={task.status}
            className={cn(
              "w-full px-3 py-2 rounded-lg text-sm appearance-none transition-all duration-200 min-h-[44px]",
              darkMode 
                ? 'bg-gray-800/50 border border-gray-700 focus:border-primary text-white' 
                : 'bg-white border border-gray-300 focus:border-primary'
            )}
          >
            <option value="Todo">To-Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={cn("block text-xs", darkMode ? 'text-gray-300' : 'text-gray-600')}>
              Subtasks
            </label>
            <button 
              onClick={handleAddSubtask}
              className={cn(
                darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600',
                "min-h-[44px] min-w-[44px] flex items-center justify-center"
              )}
            >
              + Add
            </button>
          </div>

          {/* Display existing subtasks */}
          {subtasks.length > 0 && (
            <div className={cn(
              "p-2 rounded-lg mb-2",
              darkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'
            )}>
              {subtasks.map(subtask => (
                <div key={subtask.id} className="flex items-center justify-between mb-2 last:mb-0">
                  <div className="flex items-center flex-1">
                    <input 
                      type="checkbox" 
                      checked={subtask.completed}
                      onChange={() => toggleSubtaskCompletion(subtask.id)}
                      className="mr-2 h-4 w-4 rounded border-gray-300"
                    />
                    <span className={cn(
                      "text-xs", 
                      subtask.completed && "line-through opacity-70"
                    )}>
                      {subtask.title}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteSubtask(subtask.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Subtask input form */}
          <form onSubmit={handleAddSubtask}>
            <input 
              type="text" 
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Add a subtask..."
              className={cn(
                "w-full px-3 py-2 rounded-lg text-xs transition-all duration-200 min-h-[44px]",
                darkMode 
                  ? 'bg-gray-800/50 border border-gray-700 focus:border-primary text-white placeholder-gray-600' 
                  : 'bg-white border border-gray-300 focus:border-primary placeholder-gray-400'
              )}
            />
          </form>
        </div>

        <div className="flex justify-end space-x-2 pt-2 border-t border-dashed">
          <button className={cn(
            "px-3 py-1.5 rounded-lg text-xs transition-colors duration-200 min-h-[44px] min-w-[44px]",
            darkMode
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          )}>
            Cancel
          </button>
          <button className={cn(
            "px-3 py-1.5 rounded-lg text-xs transition-colors duration-200 bg-primary/90 hover:bg-primary text-white min-h-[44px] min-w-[44px]"
          )}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
