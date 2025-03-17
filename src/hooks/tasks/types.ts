
import { TaskData, NewTaskData, SubTask } from '@/types/task';

export interface UseTasksReturn {
  tasks: TaskData[];
  isLoadingTasks: boolean;
  draggedTaskId: number | string | null;
  toggleTaskCompletion: (id: number | string) => Promise<void>;
  toggleTaskExpansion: (id: number | string) => void;
  addTask: (taskData: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
    projectId?: string;
  }) => Promise<void>;
  handleDragStart: (e: React.DragEvent, id: number | string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetId: number | string) => Promise<void>;
  clearCompletedTasks: () => Promise<void>;
}
