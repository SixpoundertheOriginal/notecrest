import React, { useState, useEffect } from 'react';
import { TaskData, NewTaskData } from '@/types/task';
import { cn } from '@/lib/utils';
import TaskAppHeader from './TaskAppHeader';
import TaskAppTabs from './TaskAppTabs';
import TasksView from './TasksView';
import CompletedTasksView from './CompletedTasksView';
import NotesView from './NotesView';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './auth/AuthModal';
import UserMenu from './auth/UserMenu';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LogIn } from 'lucide-react';

const TaskifyApp = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [darkMode, setDarkMode] = useState(true);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [draggedTaskId, setDraggedTaskId] = useState<number | string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) {
        setTasks([
          { 
            id: 1, 
            title: 'Complete project proposal (Demo)', 
            completed: false, 
            priority: 'High', 
            status: 'In Progress' as 'Todo' | 'In Progress' | 'Completed', 
            date: 'Mar 8',
            expanded: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 42) // 42 minutes ago
          },
          { 
            id: 2, 
            title: 'Review and respond to emails (Demo)', 
            completed: false, 
            priority: 'Medium', 
            status: 'Todo' as 'Todo' | 'In Progress' | 'Completed', 
            date: 'Mar 6',
            expanded: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
          },
        ]);
        return;
      }

      setIsLoadingTasks(true);
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          const formattedTasks = data.map(task => ({
            id: task.id,
            title: task.title,
            completed: task.completed,
            priority: task.priority as 'High' | 'Medium' | 'Low',
            status: task.status as 'Todo' | 'In Progress' | 'Completed',
            date: task.date,
            expanded: false,
            createdAt: new Date(task.created_at),
            user_id: task.user_id
          }));
          setTasks(formattedTasks);
        }
      } catch (error: any) {
        toast({
          title: "Error fetching tasks",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoadingTasks(false);
      }
    };

    if (!authLoading) {
      fetchTasks();
    }
  }, [user, authLoading, toast]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const toggleTaskCompletion = async (id: number | string) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;

    const newStatus = !taskToUpdate.completed 
      ? 'Completed' as const
      : taskToUpdate.status === 'Completed' 
        ? 'Todo' as const 
        : taskToUpdate.status;
        
    const updatedTasks = tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            completed: !task.completed,
            status: newStatus
          } 
        : task
    );
    setTasks(updatedTasks);

    if (user && typeof id === 'string') {
      try {
        const { error } = await supabase
          .from('tasks')
          .update({ 
            completed: !taskToUpdate.completed,
            status: newStatus
          })
          .eq('id', id);

        if (error) {
          throw error;
        }
      } catch (error: any) {
        setTasks(tasks);
        toast({
          title: "Error updating task",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const toggleTaskExpansion = (id: number | string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, expanded: !task.expanded } : { ...task, expanded: false }
    ));
  };

  const addTask = async (taskData: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (user) {
      try {
        const newTask: NewTaskData = {
          title: taskData.title,
          completed: false,
          priority: taskData.priority,
          status: 'Todo',
          date: formattedDate,
          user_id: user.id
        };
        
        const { data, error } = await supabase
          .from('tasks')
          .insert(newTask)
          .select()
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          const formattedTask: TaskData = {
            id: data.id,
            title: data.title,
            completed: data.completed,
            priority: data.priority as 'High' | 'Medium' | 'Low',
            status: data.status as 'Todo' | 'In Progress' | 'Completed',
            date: data.date,
            expanded: false,
            createdAt: new Date(data.created_at),
            user_id: data.user_id
          };
          
          setTasks([formattedTask, ...tasks]);
          
          toast({
            title: "Task created",
            description: "Your task has been added to the list.",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error creating task",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      const newId = Math.max(0, ...tasks.map(task => typeof task.id === 'number' ? task.id : 0)) + 1;
      
      const newTask: TaskData = {
        id: newId,
        title: taskData.title,
        completed: false,
        priority: taskData.priority as 'High' | 'Medium' | 'Low',
        status: 'Todo',
        date: formattedDate,
        expanded: false,
        createdAt: currentDate
      };
      
      setTasks([newTask, ...tasks]);
      
      toast({
        title: "Task created (Demo Mode)",
        description: "Sign in to save your tasks permanently.",
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, id: number | string) => {
    setDraggedTaskId(id);
    const element = e.currentTarget;
    element.classList.add('scale-105');
    setTimeout(() => element.classList.remove('scale-105'), 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetId: number | string) => {
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

  const clearCompletedTasks = async () => {
    if (!user) {
      setTasks(tasks.filter(task => !task.completed));
      toast({
        title: "Completed tasks cleared (Demo Mode)",
        description: "Sign in to save your changes permanently.",
      });
      return;
    }
    
    const completedTaskIds = tasks
      .filter(task => task.completed && typeof task.id === 'string')
      .map(task => task.id as string);
      
    if (completedTaskIds.length === 0) return;
    
    try {
      const remainingTasks = tasks.filter(task => !task.completed);
      setTasks(remainingTasks);
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .in('id', completedTaskIds);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Completed tasks cleared",
        description: `${completedTaskIds.length} task(s) removed.`,
      });
    } catch (error: any) {
      toast({
        title: "Error clearing tasks",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen dark">
      <TaskAppHeader 
        darkMode={darkMode} 
        toggleTheme={toggleTheme} 
        rightContent={
          user ? (
            <UserMenu userEmail={user.email || ''} />
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2"
            >
              <LogIn size={16} />
              Login
            </Button>
          )
        }
      />

      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-light mb-2">
              Welcome to <span className="font-bold text-gradient">Taskify</span>
            </h2>
            <p className="text-sm text-gray-400">
              {user 
                ? `Manage your tasks, ${user.email?.split('@')[0]}`
                : "Log in to save your tasks across devices"
              }
            </p>
          </div>

          <TaskAppTabs activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />

          {activeTab === 'tasks' && (
            <TasksView 
              darkMode={darkMode}
              tasks={tasks.filter(task => !task.completed)}
              isLoading={isLoadingTasks}
              draggedTaskId={draggedTaskId}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onToggleCompletion={toggleTaskCompletion}
              onToggleExpansion={toggleTaskExpansion}
              onAddTask={addTask}
              isLoggedIn={!!user}
            />
          )}
          
          {activeTab === 'completed' && (
            <CompletedTasksView 
              darkMode={darkMode}
              tasks={tasks}
              isLoading={isLoadingTasks}
              draggedTaskId={draggedTaskId}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onToggleCompletion={toggleTaskCompletion}
              onToggleExpansion={toggleTaskExpansion}
              onClearCompletedTasks={clearCompletedTasks}
            />
          )}

          {activeTab === 'notes' && (
            <NotesView darkMode={darkMode} />
          )}
        </div>
      </main>
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default TaskifyApp;
