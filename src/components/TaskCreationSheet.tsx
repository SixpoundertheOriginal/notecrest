
import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ChevronUp, ChevronDown, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface TaskCreationSheetProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onSubmit: (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => void;
}

const TaskCreationSheet = ({ isOpen, onClose, onSubmit }: TaskCreationSheetProps) => {
  // State for the form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Focus title input when sheet opens
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      setTimeout(() => titleInputRef.current.focus(), 300);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, priority, dueDate });
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate(null);
    setIsExpanded(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-auto max-h-[90vh] rounded-t-xl">
        <SheetHeader>
          <SheetTitle>New Task</SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Title input - always visible */}
            <div>
              <Input
                ref={titleInputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="text-base"
                required
              />
            </div>
            
            {/* Quick options row */}
            <div className="flex flex-wrap gap-2">
              <PrioritySelector value={priority} onChange={setPriority} />
              <QuickDateButtons onSelect={setDueDate} />
            </div>
            
            {/* Show more/less toggle */}
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
            
            {/* Additional options - conditionally visible */}
            {isExpanded && (
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description (optional)"
                  rows={3}
                />
                
                <div>
                  <Label>Due Date</Label>
                  <DatePicker date={dueDate} setDate={setDueDate} />
                </div>
              </div>
            )}
          </div>
          
          <SheetFooter>
            <Button type="button" variant="ghost" onClick={() => onClose(false)}>Cancel</Button>
            <Button type="submit" disabled={!title.trim()}>Create Task</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};

// Priority selector component
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

// Quick date buttons component
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

// DatePicker component
interface DatePickerProps {
  date: Date | null;
  setDate: (date: Date | null) => void;
}

const DatePicker = ({ date, setDate }: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal mt-1",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={setDate}
          initialFocus
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};

export default TaskCreationSheet;
