import React, { useState } from 'react';
import { TaskData } from '@/types/task';
import { cn } from '@/lib/utils';
import TaskAppHeader from './TaskAppHeader';
import TaskAppTabs from './TaskAppTabs';
import TasksView from './TasksView';
import NotesView from './NotesView';
import { useToast } from '@/components/ui/use-toast';

const TaskifyApp = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [darkMode, setDarkMode] = useState(true);
  const { toast } = useToast();
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

  const addTask = () => {
    const newId = Math.max(0, ...tasks.map(task => task.id)) + 1;
    
    const newTask: TaskData = {
      id: newId,
      title: 'New task',
      completed: false,
      priority: 'Medium',
      status: 'Todo',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      expanded: false
    };
    
    setTasks([newTask, ...tasks]);
    
    toast({
      title: "New task created",
      description: "Your task has been added to the list.",
    });
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
    <div className={`flex flex-col min-h-screen ${darkMode ? 'dark bg-[#1A1F2C]' : 'bg-gray-50'}`}>
      <TaskAppHeader darkMode={darkMode} toggleTheme={toggleTheme} />

      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-light mb-2">
              Welcome to <span className="font-bold text-gradient">Taskify</span>
            </h2>
            <p className={cn("text-sm", darkMode ? 'text-gray-400' : 'text-gray-500')}>
              Manage your tasks and notes efficiently
            </p>
          </div>

          <TaskAppTabs activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />

          {activeTab === 'tasks' && (
            <TasksView 
              darkMode={darkMode}
              tasks={tasks}
              draggedTaskId={draggedTaskId}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onToggleCompletion={toggleTaskCompletion}
              onToggleExpansion={toggleTaskExpansion}
              onAddTask={addTask}
            />
          )}

          {activeTab === 'notes' && (
            <NotesView darkMode={darkMode} />
          )}
        </div>
      </main>
    </div>
  );
};

export default TaskifyApp;
