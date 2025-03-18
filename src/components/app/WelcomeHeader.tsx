
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import TaskProgressDashboard from '@/components/dashboard/TaskProgressDashboard';
import { TaskData } from '@/types/task';

interface WelcomeHeaderProps {
  username?: string;
  isLoggedIn: boolean;
  onOpenAuth?: () => void;
  tasks?: TaskData[];
}

const WelcomeHeader = ({ username, isLoggedIn, onOpenAuth, tasks = [] }: WelcomeHeaderProps) => {
  // If we have tasks, show the TaskProgressDashboard
  if (tasks.length > 0 || isLoggedIn) {
    return (
      <TaskProgressDashboard 
        tasks={tasks} 
        username={username} 
        isLoggedIn={isLoggedIn} 
      />
    );
  }
  
  // If no tasks (likely a new user), show the original welcome message
  return (
    <div className="mb-8 text-center pt-4 md:pt-0">
      <h2 className="text-2xl md:text-3xl font-light mb-2">
        Welcome to <span className="font-bold text-gradient">Taskify</span>
      </h2>
      <p className="text-sm text-white mb-4">
        {isLoggedIn 
          ? `Manage your tasks, ${username || 'User'}`
          : "Log in to save your tasks across devices"
        }
      </p>
      
      {!isLoggedIn && onOpenAuth && (
        <Button 
          onClick={onOpenAuth} 
          variant="outline" 
          className="mt-2 bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 text-blue-400"
        >
          <LogIn size={16} className="mr-1" />
          Login or Sign up
        </Button>
      )}
    </div>
  );
};

export default WelcomeHeader;
