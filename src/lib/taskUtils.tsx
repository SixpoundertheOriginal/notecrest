
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
      bg: 'from-[#D946EF] to-[#F97316]',
      dot: 'bg-[#D946EF]',
      text: 'text-[#D946EF]',
      border: 'border-[#D946EF]/30',
      light: 'bg-[#D946EF]/10',
      dark: 'bg-[#D946EF]/20',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-[#D946EF]"><path d="m6 15 6-6 6 6"></path></svg>
    };
    case 'Medium': return {
      bg: 'from-[#8B5CF6] to-[#6366F1]',
      dot: 'bg-[#8B5CF6]',
      text: 'text-[#8B5CF6]',
      border: 'border-[#8B5CF6]/30',
      light: 'bg-[#8B5CF6]/10',
      dark: 'bg-[#8B5CF6]/20',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-[#8B5CF6]"><path d="M8 12h8"></path></svg>
    };
    case 'Low': return {
      bg: 'from-[#0EA5E9] to-[#38BDF8]',
      dot: 'bg-[#0EA5E9]',
      text: 'text-[#0EA5E9]',
      border: 'border-[#0EA5E9]/30',
      light: 'bg-[#0EA5E9]/10',
      dark: 'bg-[#0EA5E9]/20',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-[#0EA5E9]"><path d="m6 9 6 6 6-6"></path></svg>
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
