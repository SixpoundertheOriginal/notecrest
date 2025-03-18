
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobileValue } from '@/hooks/use-mobile';
import { 
  ToggleGroup,
  ToggleGroupItem 
} from '@/components/ui/toggle-group';
import { 
  Clock,
  Calendar,
  ArrowUpDown,
  AlertTriangle
} from 'lucide-react';

interface TaskFiltersProps {
  darkMode: boolean;
  onSortChange?: (value: string) => void;
  value?: string;
}

const TaskFilters = ({ darkMode, onSortChange, value = "date-desc" }: TaskFiltersProps) => {
  const isMobile = useIsMobileValue();
  
  // Hide the filters on mobile devices
  if (isMobile) {
    return null;
  }
  
  const handleValueChange = (value: string) => {
    if (value && onSortChange) {
      onSortChange(value);
    }
  };
  
  return (
    <div className="overflow-x-auto pb-1">
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={handleValueChange}
        className={cn(
          "justify-start w-full bg-white/5 border border-white/10 rounded-lg p-1",
          "transition-all duration-200"
        )}
      >
        <ToggleGroupItem 
          value="date-desc" 
          className={cn(
            "flex items-center gap-1.5 data-[state=on]:bg-blue-500/20 data-[state=on]:text-blue-400",
            "transition-all duration-200 min-h-[44px] min-w-[44px]"
          )}
          aria-label="Sort by newest first"
        >
          <Clock size={14} />
          <span className="text-xs">Newest</span>
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="date-asc" 
          className={cn(
            "flex items-center gap-1.5 data-[state=on]:bg-green-500/20 data-[state=on]:text-green-400",
            "transition-all duration-200 min-h-[44px] min-w-[44px]"
          )}
          aria-label="Sort by oldest first"
        >
          <Calendar size={14} />
          <span className="text-xs">Oldest</span>
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="priority-desc" 
          className={cn(
            "flex items-center gap-1.5 data-[state=on]:bg-purple-500/20 data-[state=on]:text-purple-400",
            "transition-all duration-200 min-h-[44px] min-w-[44px]"
          )}
          aria-label="Sort by highest priority first"
        >
          <AlertTriangle size={14} />
          <span className="text-xs">Priority</span>
        </ToggleGroupItem>
        
        <ToggleGroupItem 
          value="title-asc" 
          className={cn(
            "flex items-center gap-1.5 data-[state=on]:bg-amber-500/20 data-[state=on]:text-amber-400",
            "transition-all duration-200 min-h-[44px] min-w-[44px]"
          )}
          aria-label="Sort alphabetically A-Z"
        >
          <ArrowUpDown size={14} />
          <span className="text-xs">A-Z</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default TaskFilters;
