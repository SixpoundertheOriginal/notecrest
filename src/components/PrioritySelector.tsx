
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
              'Low': 'bg-green-600 hover:bg-green-700 text-white',
              'Medium': 'bg-yellow-600 hover:bg-yellow-700 text-white',
              'High': 'bg-red-600 hover:bg-red-700 text-white',
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
