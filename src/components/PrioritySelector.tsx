
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PrioritySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const PrioritySelector = ({ value, onChange }: PrioritySelectorProps) => {
  const priorities = ['Low', 'Medium', 'High'];
  
  return (
    <div className="flex gap-1">
      {priorities.map((priority) => (
        <Button
          key={priority}
          type="button"
          variant={value === priority ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(priority)}
          className={cn(
            "min-h-[44px] min-w-[44px]",
            value === priority && {
              'Low': 'bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white',
              'Medium': 'bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white',
              'High': 'bg-[#D946EF] hover:bg-[#D946EF]/90 text-white',
            }[priority]
          )}
        >
          {priority}
        </Button>
      ))}
    </div>
  );
};

export default PrioritySelector;
