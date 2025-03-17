
export interface TaskData {
  id: number | string;
  title: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Todo' | 'In Progress' | 'Completed';
  date: string;
  expanded: boolean;
  createdAt: Date;
  user_id?: string;
  project_id?: string | null;
  description?: string; // Add description field
}

export interface NewTaskData {
  title: string;
  completed: boolean;
  priority: string;
  status: string;
  date: string;
  user_id: string; // Changed from optional to required
  project_id?: string | null;
  description?: string; // Add description field
}
