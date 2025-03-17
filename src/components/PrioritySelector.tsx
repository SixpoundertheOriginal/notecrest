
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
            value === priority && {
              'Low': 'bg-green-500 hover:bg-green-600',
              'Medium': 'bg-yellow-500 hover:bg-yellow-600',
              'High': 'bg-red-500 hover:bg-red-600',
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
