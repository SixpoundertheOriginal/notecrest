
import React, { createContext, useContext, ReactNode } from 'react';
import { useTasksImplementation } from '@/hooks/tasks';
import { UseTasksReturn } from '@/hooks/tasks/types';
import { User } from '@/types/auth';

interface TasksContextType extends UseTasksReturn {}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children, user }: { children: ReactNode, user: User | null }) {
  const tasksImplementation = useTasksImplementation(user);

  return (
    <TasksContext.Provider value={tasksImplementation}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks(): TasksContextType {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}
