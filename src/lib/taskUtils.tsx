
import { ReactNode } from 'react';
import { CheckCircle, AlertTriangle, Minus, ArrowDown } from 'lucide-react';

export const getStatusIcon = (status: string): ReactNode => {
  switch(status) {
    case 'Completed': 
      return <CheckCircle size={14} className="mr-1 text-emerald-500" />;
    case 'In Progress': 
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-amber-500">
          <path d="M6 10V4a2 2 0 1 1 4 0v6"></path>
          <path d="M4 10a2 2 0 1 0 4 0H4Z"></path>
          <path d="M14 10V4a2 2 0 1 1 4 0v6"></path>
          <path d="M12 10a2 2 0 1 0 4 0h-4Z"></path>
          <path d="M4.6 20h14.8"></path>
          <path d="M12 10v10"></path>
        </svg>
      );
    default: 
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-blue-500">
          <path d="M8 2v4"></path>
          <path d="M16 2v4"></path>
          <rect width="16" height="18" x="4" y="4" rx="2"></rect>
          <path d="M10 16h4"></path>
        </svg>
      );
  }
};

interface PriorityColor {
  bg: string;
  dot: string;
  text: string;
  border: string;
  light: string;
  dark: string;
  icon: ReactNode;
}

export const getPriorityColor = (priority: string): PriorityColor => {
  switch(priority) {
    case 'High': return {
      bg: 'from-rose-500 to-rose-600',
      dot: 'bg-rose-500',
      text: 'text-rose-500',
      border: 'border-rose-500/30',
      light: 'bg-rose-500/10',
      dark: 'bg-rose-500/20',
      icon: <AlertTriangle size={12} className="mr-1 text-rose-500" />
    };
    case 'Medium': return {
      bg: 'from-amber-500 to-amber-600',
      dot: 'bg-amber-500',
      text: 'text-amber-500',
      border: 'border-amber-500/30',
      light: 'bg-amber-500/10',
      dark: 'bg-amber-500/20',
      icon: <Minus size={12} className="mr-1 text-amber-500" />
    };
    case 'Low': return {
      bg: 'from-blue-500 to-blue-600',
      dot: 'bg-blue-500',
      text: 'text-blue-500',
      border: 'border-blue-500/30',
      light: 'bg-blue-500/10',
      dark: 'bg-blue-500/20',
      icon: <ArrowDown size={12} className="mr-1 text-blue-500" />
    };
    default: return {
      bg: 'from-slate-400 to-slate-500',
      dot: 'bg-slate-500',
      text: 'text-slate-500',
      border: 'border-slate-300',
      light: 'bg-slate-50',
      dark: 'bg-slate-900/20',
      icon: null
    };
  }
};
