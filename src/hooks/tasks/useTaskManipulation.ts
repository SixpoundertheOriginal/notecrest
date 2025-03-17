
import { useState } from 'react';
import { TaskData, SubTask } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useTaskManipulation = (
  tasks: TaskData[],
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>,
  user: any
) => {
  const [draggedTaskId, setDraggedTaskId] = useState<number | string | null>(null);
  const { toast } = useToast();

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

  return {
    draggedTaskId,
    toggleTaskCompletion,
    toggleTaskExpansion,
    handleDragStart,
    handleDragOver,
    handleDrop,
  };
};
