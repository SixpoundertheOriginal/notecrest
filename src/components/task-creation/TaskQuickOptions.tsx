
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PrioritySelector from '../PrioritySelector';
import QuickDateButtons from '../QuickDateButtons';

interface TaskQuickOptionsProps {
  priority: string;
  setPriority: (priority: string) => void;
  setDueDate: (date: Date | null) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const TaskQuickOptions = ({
  priority,
  setPriority,
  setDueDate,
  isExpanded,
  setIsExpanded
}: TaskQuickOptionsProps) => {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <PrioritySelector value={priority} onChange={setPriority} />
        <QuickDateButtons onSelect={setDueDate} />
      </div>
      
      <Button 
        type="button" 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between"
      >
        {isExpanded ? 'Less options' : 'More options'}
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </Button>
    </>
  );
};

export default TaskQuickOptions;
