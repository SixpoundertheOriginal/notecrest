
import { create } from 'zustand';
import { TaskData } from '@/types/task';
import { supabase } from '@/integrations/supabase/client';

interface TaskState {
  tasks: TaskData[];
  isLoadingTasks: boolean;
  draggedTaskId: number | string | null;
  
  // Actions
  setTasks: (tasks: TaskData[]) => void;
  fetchTasks: (userId: string | undefined) => Promise<void>;
  addTask: (taskData: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
    projectId?: string;
  }, userId: string | undefined) => Promise<void>;
  toggleTaskCompletion: (id: number | string, userId: string | undefined) => Promise<void>;
  toggleTaskExpansion: (id: number | string) => void;
  clearCompletedTasks: (userId: string | undefined) => Promise<void>;
  
  // Drag and drop
  setDraggedTaskId: (id: number | string | null) => void;
  handleDragStart: (e: React.DragEvent, id: number | string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetId: number | string, userId: string | undefined) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoadingTasks: false,
  draggedTaskId: null,

  setTasks: (tasks) => set({ tasks }),
  
  fetchTasks: async (userId) => {
    set({ isLoadingTasks: true });
    
    if (!userId) {
      // Demo tasks for non-authenticated users
      set({
        tasks: [
          { 
            id: 1, 
            title: 'Complete project proposal (Demo)', 
            completed: false, 
            priority: 'High', 
            status: 'In Progress' as 'Todo' | 'In Progress' | 'Completed', 
            date: 'Mar 8',
            expanded: false,
            project_id: '1', // Main project
            createdAt: new Date(Date.now() - 1000 * 60 * 42), // 42 minutes ago
            subtasks: []
          },
          { 
            id: 2, 
            title: 'Review and respond to emails (Demo)', 
            completed: false, 
            priority: 'Medium', 
            status: 'Todo' as 'Todo' | 'In Progress' | 'Completed', 
            date: 'Mar 6',
            expanded: false,
            project_id: '2', // Projects project
            createdAt: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
            subtasks: []
          },
        ],
        isLoadingTasks: false
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const formattedTasks: TaskData[] = data.map(task => {
          // Parse subtasks
          let parsedSubtasks = [];
          if (task.subtasks) {
            if (Array.isArray(task.subtasks)) {
              parsedSubtasks = task.subtasks.map((st: any) => ({
                id: st.id || `subtask-${Math.random().toString(36).substr(2, 9)}`,
                title: st.title || '',
                completed: Boolean(st.completed)
              }));
            } else if (typeof task.subtasks === 'string') {
              try {
                const parsed = JSON.parse(task.subtasks);
                if (Array.isArray(parsed)) {
                  parsedSubtasks = parsed.map((st: any) => ({
                    id: st.id || `subtask-${Math.random().toString(36).substr(2, 9)}`,
                    title: st.title || '',
                    completed: Boolean(st.completed)
                  }));
                }
              } catch (e) {
                console.error("Failed to parse subtasks string", e);
              }
            }
          }

          return {
            id: task.id,
            title: task.title,
            completed: task.completed,
            priority: task.priority as 'High' | 'Medium' | 'Low',
            status: task.status as 'Todo' | 'In Progress' | 'Completed',
            date: task.date,
            expanded: false,
            createdAt: new Date(task.created_at),
            user_id: task.user_id,
            project_id: task.project_id || null,
            subtasks: parsedSubtasks
          };
        });
        
        set({ tasks: formattedTasks });
      }
    } catch (error: any) {
      console.error("Error fetching tasks:", error.message);
    } finally {
      set({ isLoadingTasks: false });
    }
  },
  
  addTask: async (taskData, userId) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (userId) {
      try {
        // Create a properly typed task object that matches Supabase's expectations
        const newTaskData = {
          title: taskData.title,
          completed: false,
          priority: taskData.priority,
          status: 'Todo',
          date: formattedDate,
          user_id: userId,
          project_id: taskData.projectId || null
        };
        
        const { data, error } = await supabase
          .from('tasks')
          .insert(newTaskData)
          .select();

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const formattedTask: TaskData = {
            id: data[0].id,
            title: data[0].title,
            completed: data[0].completed,
            priority: data[0].priority as 'High' | 'Medium' | 'Low',
            status: data[0].status as 'Todo' | 'In Progress' | 'Completed',
            date: data[0].date,
            expanded: false,
            createdAt: new Date(data[0].created_at),
            user_id: data[0].user_id,
            project_id: data[0].project_id || null,
            subtasks: []
          };
          
          set(state => ({ tasks: [formattedTask, ...state.tasks] }));
        }
      } catch (error: any) {
        console.error("Error creating task:", error.message);
      }
    } else {
      const tasks = get().tasks;
      const newId = Math.max(0, ...tasks.map(task => typeof task.id === 'number' ? task.id : 0)) + 1;
      
      const newTask: TaskData = {
        id: newId,
        title: taskData.title,
        completed: false,
        priority: taskData.priority as 'High' | 'Medium' | 'Low',
        status: 'Todo',
        date: formattedDate,
        expanded: false,
        createdAt: currentDate,
        project_id: taskData.projectId || null,
        subtasks: []
      };
      
      set(state => ({ tasks: [newTask, ...state.tasks] }));
    }
  },
  
  toggleTaskCompletion: async (id, userId) => {
    const tasks = get().tasks;
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
    set({ tasks: updatedTasks });

    if (userId && typeof id === 'string') {
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
        // Revert changes on error
        set({ tasks });
        console.error("Error updating task:", error.message);
      }
    }
  },
  
  toggleTaskExpansion: (id) => {
    set(state => ({
      tasks: state.tasks.map(task => 
        task.id === id ? { ...task, expanded: !task.expanded } : { ...task, expanded: false }
      )
    }));
  },
  
  clearCompletedTasks: async (userId) => {
    const tasks = get().tasks;
    
    if (!userId) {
      set({ tasks: tasks.filter(task => !task.completed) });
      return;
    }
    
    const completedTaskIds = tasks
      .filter(task => task.completed && typeof task.id === 'string')
      .map(task => task.id as string);
      
    if (completedTaskIds.length === 0) return;
    
    try {
      const remainingTasks = tasks.filter(task => !task.completed);
      set({ tasks: remainingTasks });
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .in('id', completedTaskIds);
        
      if (error) {
        throw error;
      }
    } catch (error: any) {
      // Revert on error
      set({ tasks });
      console.error("Error clearing tasks:", error.message);
    }
  },
  
  setDraggedTaskId: (id) => set({ draggedTaskId: id }),
  
  handleDragStart: (e, id) => {
    set({ draggedTaskId: id });
    const element = e.currentTarget;
    element.classList.add('scale-105');
    setTimeout(() => element.classList.remove('scale-105'), 0);
  },
  
  handleDragOver: (e) => {
    e.preventDefault();
  },
  
  handleDrop: async (e, targetId, userId) => {
    e.preventDefault();
    const draggedTaskId = get().draggedTaskId;
    
    if (draggedTaskId === null || draggedTaskId === targetId) return;
    
    const tasks = [...get().tasks];
    const draggedTaskIndex = tasks.findIndex(task => task.id === draggedTaskId);
    const targetTaskIndex = tasks.findIndex(task => task.id === targetId);
    
    const [draggedTask] = tasks.splice(draggedTaskIndex, 1);
    tasks.splice(targetTaskIndex, 0, draggedTask);
    
    set({ tasks, draggedTaskId: null });
  }
}));
