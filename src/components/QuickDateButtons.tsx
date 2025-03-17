
import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickDateButtonsProps {
  onSelect: (date: Date | null) => void;
}

const QuickDateButtons = ({ onSelect }: QuickDateButtonsProps) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const quickDates = [
    { label: 'Today', date: today },
    { label: 'Tomorrow', date: tomorrow },
    { label: 'Next Week', date: nextWeek },
  ];
  
  return (
    <div className="flex gap-1">
      {quickDates.map(({ label, date }) => (
        <Button
          key={label}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onSelect(date)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default QuickDateButtons;
