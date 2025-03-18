
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertTriangle, Minus, ArrowDown } from 'lucide-react';

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
              'Low': 'bg-blue-500 hover:bg-blue-600 text-white',
              'Medium': 'bg-amber-500 hover:bg-amber-600 text-white',
              'High': 'bg-rose-500 hover:bg-rose-600 text-white',
            }[priority]
          )}
        >
          <span className="mr-1.5 flex items-center">
            {priority === 'High' && <AlertTriangle size={14} />}
            {priority === 'Medium' && <Minus size={14} />}
            {priority === 'Low' && <ArrowDown size={14} />}
          </span>
          {priority}
        </Button>
      ))}
    </div>
  );
};

export default PrioritySelector;
