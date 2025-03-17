
import React, { useState } from 'react';
import { ListFilter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobileValue } from '@/hooks/use-mobile';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TaskFiltersProps {
  darkMode: boolean;
}

const TaskFilters = ({ darkMode }: TaskFiltersProps) => {
  const isMobile = useIsMobileValue();
  const [activeFilter, setActiveFilter] = useState<string>("list");
  
  return (
    <div className="overflow-x-auto pb-1">
      <Tabs defaultValue="list" className="w-full" onValueChange={setActiveFilter}>
        <TabsList className="bg-white/5 border border-white/10 w-full">
          <TabsTrigger 
            value="list"
            className={cn(
              "flex items-center gap-1 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400",
              "transition-all duration-200 min-h-[44px] min-w-[44px]"
            )}
          >
            <ListFilter size={14} />
            <span>List</span>
          </TabsTrigger>
          <TabsTrigger 
            value="priority"
            className={cn(
              "flex items-center gap-1 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400",
              "transition-all duration-200 min-h-[44px] min-w-[44px]"
            )}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={activeFilter === "priority" ? "text-purple-400" : ""}
            >
              <path d="m3 8 4-4 4 4"></path>
              <path d="M7 4v16"></path>
              <path d="M11 12h4"></path>
              <path d="M11 16h7"></path>
              <path d="M11 20h10"></path>
            </svg>
            <span>By Priority</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TaskFilters;
