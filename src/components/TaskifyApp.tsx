
import React, { useState } from 'react';
import { Calendar, CheckCircle, ChevronDown, Clock, ListFilter, Moon, PlusCircle, Search, Square, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskData } from '@/types/task';
import { getPriorityColor, getStatusIcon } from '@/lib/taskUtils';
import TaskCard from './TaskCard';
import TaskDetails from './TaskDetails';

const TaskifyApp = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [darkMode, setDarkMode] = useState(true);
  const [tasks, setTasks] = useState<TaskData[]>([
    { 
      id: 1, 
      title: 'Complete project proposal', 
      completed: false, 
      priority: 'High', 
      status: 'In Progress',
      date: 'Mar 8',
      expanded: false
    },
    { 
      id: 2, 
      title: 'Review and respond to emails', 
      completed: false, 
      priority: 'Medium', 
      status: 'Todo',
      date: 'Mar 6',
      expanded: false
    },
    { 
      id: 3, 
      title: 'Buy groceries', 
      completed: false, 
      priority: 'Low', 
      status: 'Todo',
      date: 'Mar 9',
      expanded: false
    },
    { 
      id: 4, 
      title: 'Schedule doctor appointment', 
      completed: true, 
      priority: 'Medium', 
      status: 'Completed',
      date: 'Mar 5',
      expanded: false
    }
  ]);
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);

  const toggleTheme = () => setDarkMode(!darkMode);

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            completed: !task.completed,
            status: !task.completed ? 'Completed' : task.status === 'Completed' ? 'Todo' : task.status
          } 
        : task
    ));
  };

  const toggleTaskExpansion = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, expanded: !task.expanded } : { ...task, expanded: false }
    ));
  };

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedTaskId(id);
    const element = e.currentTarget;
    element.classList.add('scale-105');
    setTimeout(() => element.classList.remove('scale-105'), 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    
    if (draggedTaskId === null || draggedTaskId === targetId) return;
    
    const tasksCopy = [...tasks];
    const draggedTaskIndex = tasksCopy.findIndex(task => task.id === draggedTaskId);
    const targetTaskIndex = tasksCopy.findIndex(task => task.id === targetId);
    
    const [draggedTask] = tasksCopy.splice(draggedTaskIndex, 1);
    tasksCopy.splice(targetTaskIndex, 0, draggedTask);
    
    setTasks(tasksCopy);
    setDraggedTaskId(null);
  };

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={cn(
        "p-4 backdrop-blur-md sticky top-0 z-10",
        darkMode ? 'bg-black/40' : 'bg-white/60'
      )}>
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
            Taskify
          </h1>
          <button 
            onClick={toggleTheme} 
            className={cn(
              "p-2 rounded-full transition-all duration-300",
              darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
            )}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow p-6">
        <div className="max-w-4xl mx-auto">
          {/* Welcome section */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-light mb-2">
              Welcome to <span className="font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">Taskify</span>
            </h2>
            <p className={cn("text-sm", darkMode ? 'text-gray-400' : 'text-gray-500')}>
              Manage your tasks and notes in one place
            </p>
          </div>

          {/* Tabs */}
          <div className={cn(
            "flex mb-6 rounded-2xl overflow-hidden backdrop-blur-sm border",
            darkMode ? 'bg-gray-900/30 border-gray-800' : 'bg-white/50 border-gray-200'
          )}>
            <button 
              onClick={() => setActiveTab('tasks')} 
              className={cn(
                "flex-1 py-3 px-4 flex items-center justify-center transition-all duration-300",
                activeTab === 'tasks' 
                  ? (darkMode ? 'bg-gray-800/50 text-blue-400' : 'bg-white text-blue-500') 
                  : ''
              )}
            >
              Tasks
            </button>
            <button 
              onClick={() => setActiveTab('notes')} 
              className={cn(
                "flex-1 py-3 px-4 flex items-center justify-center transition-all duration-300",
                activeTab === 'notes' 
                  ? (darkMode ? 'bg-gray-800/50 text-blue-400' : 'bg-white text-blue-500') 
                  : ''
              )}
            >
              Notes
            </button>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'tasks' && (
            <div className={cn(
              "rounded-2xl backdrop-blur-sm",
              darkMode ? 'bg-gray-900/30 border border-gray-800' : 'bg-white/70 border border-gray-200'
            )}>
              {/* Search and filters */}
              <div className="p-4 flex flex-wrap gap-2">
                <div className={cn(
                  "flex-grow flex items-center rounded-xl px-3 border",
                  darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100/70 border-gray-200'
                )}>
                  <Search size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  <input 
                    type="text" 
                    placeholder="Search tasks..." 
                    className={cn(
                      "w-full p-2 bg-transparent focus:outline-none text-sm",
                      darkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'
                    )}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button className={cn(
                    "px-3 py-2 rounded-xl flex items-center text-sm",
                    darkMode 
                      ? 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700' 
                      : 'bg-gray-100/70 hover:bg-gray-200/70 border border-gray-200'
                  )}>
                    <ListFilter size={14} className="mr-1" />
                    <span>List</span>
                  </button>
                  <button className={cn(
                    "px-3 py-2 rounded-xl flex items-center text-sm",
                    darkMode 
                      ? 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700' 
                      : 'bg-gray-100/70 hover:bg-gray-200/70 border border-gray-200'
                  )}>
                    By Priority
                  </button>
                </div>
              </div>

              {/* Add task button */}
              <div className="px-4 pb-4">
                <button className={cn(
                  "w-full py-3 rounded-xl flex items-center justify-center text-sm transition-all duration-300 border",
                  darkMode 
                    ? 'border-gray-700 bg-gradient-to-r from-blue-500/20 to-violet-500/20 hover:from-blue-500/30 hover:to-violet-500/30 text-blue-400' 
                    : 'border-blue-200 bg-gradient-to-r from-blue-50 to-violet-50 hover:from-blue-100 hover:to-violet-100 text-blue-500'
                )}>
                  <PlusCircle size={16} className="mr-2" />
                  Add New Task
                </button>
              </div>

              {/* Tasks list */}
              <div className="grid grid-cols-1 gap-4 p-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    darkMode={darkMode}
                    draggedTaskId={draggedTaskId}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onToggleCompletion={toggleTaskCompletion}
                    onToggleExpansion={toggleTaskExpansion}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className={cn(
              "p-6 rounded-2xl backdrop-blur-sm flex justify-center items-center",
              darkMode ? 'bg-gray-900/30 border border-gray-800' : 'bg-white/70 border border-gray-200'
            )}>
              <p className="text-sm">Notes content would appear here</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TaskifyApp;
