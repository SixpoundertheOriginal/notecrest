
export interface TaskData {
  id: number;
  title: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Todo' | 'In Progress' | 'Completed';
  date: string;
  expanded: boolean;
  createdAt: Date; // Updated to be required
}
