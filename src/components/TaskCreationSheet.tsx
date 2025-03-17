
import React, { useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
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
import PrioritySelector from './PrioritySelector';
import QuickDateButtons from './QuickDateButtons';
import DatePicker from './DatePicker';

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
  const nlpTimeout = useRef<NodeJS.Timeout>();

  // Focus title input when sheet opens
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      // Reduced timeout for faster focus
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // NLP parsing function to extract date, time and priority
  const parseNaturalLanguage = (input: string) => {
    let result = {
      title: input,
      date: null as Date | null,
      priority: null as string | null
    };
    
    // Extract date patterns
    const tomorrowMatch = input.match(/\btomorrow\b/i);
    const todayMatch = input.match(/\btoday\b/i);
    const nextWeekMatch = input.match(/\bnext week\b/i);
    
    if (tomorrowMatch) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      result.date = tomorrow;
      result.title = result.title.replace(tomorrowMatch[0], '').trim();
    } else if (todayMatch) {
      result.date = new Date();
      result.title = result.title.replace(todayMatch[0], '').trim();
    } else if (nextWeekMatch) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      result.date = nextWeek;
      result.title = result.title.replace(nextWeekMatch[0], '').trim();
    }
    
    // Extract priority keywords
    const highPriorityMatch = input.match(/\b(urgent|high priority|important)\b/i);
    const mediumPriorityMatch = input.match(/\b(medium priority|normal)\b/i);
    const lowPriorityMatch = input.match(/\b(low priority|whenever|someday)\b/i);
    
    if (highPriorityMatch) {
      result.priority = 'High';
      result.title = result.title.replace(highPriorityMatch[0], '').trim();
    } else if (mediumPriorityMatch) {
      result.priority = 'Medium';
      result.title = result.title.replace(mediumPriorityMatch[0], '').trim();
    } else if (lowPriorityMatch) {
      result.priority = 'Low';
      result.title = result.title.replace(lowPriorityMatch[0], '').trim();
    }
    
    // Clean up any trailing punctuation or double spaces
    result.title = result.title.replace(/\s{2,}/g, ' ').trim();
    result.title = result.title.replace(/[,.;:]+$/, '').trim();
    
    return result;
  };

  // Handle title input with NLP processing
  const handleTitleInput = (value: string) => {
    setTitle(value);
    
    // Run NLP parsing after user stops typing
    clearTimeout(nlpTimeout.current);
    nlpTimeout.current = setTimeout(() => {
      const parsedInput = parseNaturalLanguage(value);
      if (parsedInput.date) setDueDate(parsedInput.date);
      if (parsedInput.priority) setPriority(parsedInput.priority);
      if (parsedInput.title !== value) setTitle(parsedInput.title);
    }, 800);
  };

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
                onChange={(e) => handleTitleInput(e.target.value)}
                placeholder="What do you need to do?"
                className="text-base py-6"
                required
                autoComplete="off"
                autoFocus
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

export default TaskCreationSheet;
