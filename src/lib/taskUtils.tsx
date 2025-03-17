
import { ReactNode } from 'react';
import { CheckCircle } from 'lucide-react';

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
      bg: 'from-red-400 to-rose-500',
      dot: 'bg-red-500',
      text: 'text-red-500',
      border: 'border-red-300',
      light: 'bg-red-50',
      dark: 'bg-red-900/20',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-red-500"><path d="m6 15 6-6 6 6"></path></svg>
    };
    case 'Medium': return {
      bg: 'from-amber-300 to-yellow-500',
      dot: 'bg-yellow-500',
      text: 'text-yellow-500',
      border: 'border-yellow-300',
      light: 'bg-yellow-50',
      dark: 'bg-yellow-900/20',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-yellow-500"><path d="M8 12h8"></path></svg>
    };
    case 'Low': return {
      bg: 'from-blue-400 to-indigo-500',
      dot: 'bg-blue-500',
      text: 'text-blue-500',
      border: 'border-blue-300',
      light: 'bg-blue-50',
      dark: 'bg-blue-900/20',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-blue-500"><path d="m6 9 6 6 6-6"></path></svg>
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
