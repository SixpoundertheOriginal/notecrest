
import React, { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { TaskData } from '@/types/task';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock } from 'lucide-react';

interface TaskProgressDashboardProps {
  tasks: TaskData[];
  username?: string;
  isLoggedIn: boolean;
}

const TaskProgressDashboard = ({ tasks, username, isLoggedIn }: TaskProgressDashboardProps) => {
  // Memoize task-related metrics calculation
  const metrics = useMemo(() => {
    console.log('Recalculating dashboard metrics');
    
    // Only consider visible tasks (not completed tasks)
    const visibleTasks = tasks.filter(task => !task.completed);
    const totalTasks = visibleTasks.length;
    const completedTasks = 0; // These are filtered out already
    
    // For today's tasks, compare the task date with today's date in the same format
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const todayTasks = visibleTasks.filter(task => {
      if (!task.date) return false;
      
      // Try to match formats like "Mar 18" or similar
      return task.date === today || 
             task.date.includes(today) || 
             // Also check if the date is today in another format
             (task.createdAt && new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === today);
    }).length;
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const highPriorityTasks = visibleTasks.filter(task => task.priority === 'High').length;
    
    return {
      totalTasks,
      completedTasks,
      todayTasks,
      completionRate,
      highPriorityTasks
    };
  }, [tasks]);

  // Memoize motivational message calculation
  const motivationalMessage = useMemo(() => {
    if (metrics.totalTasks === 0) {
      return "Ready to add some tasks for today? 🌠";
    } else if (metrics.completionRate >= 75) {
      return "Excellent progress! You're crushing it! 🚀";
    } else if (metrics.completionRate >= 50) {
      return "Great work! You're halfway there! ✨";
    } else if (metrics.completionRate >= 25) {
      return "Good start! Keep the momentum going! 💫";
    } else {
      return "You've started your journey! Keep going! 🌟";
    }
  }, [metrics.totalTasks, metrics.completionRate]);

  return (
    <div className="mb-8 text-center pt-4 md:pt-0">
      <div className="mb-3">
        <h2 className="text-2xl md:text-3xl font-light mb-2">
          <span className="font-bold text-gradient">Taskify</span> Dashboard
        </h2>
        <p className="text-sm text-white mb-2">
          {isLoggedIn 
            ? `Hello, ${username || 'User'}! Here's your progress:`
            : "Track your productivity with Taskify"
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-4">
        {/* Progress Bar */}
        <div className="glass-morphism p-4 rounded-lg border border-white/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Active Tasks</span>
            <span className="text-sm font-bold">{metrics.totalTasks}</span>
          </div>
          <Progress 
            value={metrics.totalTasks > 0 ? 100 : 0} 
            className="h-2 bg-white/10" 
          />
          <p className="text-xs mt-2 text-muted-foreground">
            {metrics.totalTasks} tasks to work on
          </p>
        </div>

        {/* Task Stats */}
        <div className="glass-morphism p-4 rounded-lg border border-white/10">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <div className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full mr-2",
                "bg-blue-500/20 text-blue-400"
              )}>
                <Clock size={16} />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Today</p>
                <p className="text-sm font-medium">{metrics.todayTasks} tasks</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full mr-2",
                "bg-orange-500/20 text-orange-400"
              )}>
                <CheckCircle size={16} />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">High Priority</p>
                <p className="text-sm font-medium">{metrics.highPriorityTasks} tasks</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-blue-400 font-medium animate-cosmic-pulse">
        {motivationalMessage}
      </p>
    </div>
  );
};

export default React.memo(TaskProgressDashboard);
