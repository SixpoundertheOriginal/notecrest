
import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, Flag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SmartTaskInputProps {
  onCreateTask: (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => void;
  darkMode: boolean;
}

const SmartTaskInput: React.FC<SmartTaskInputProps> = ({ onCreateTask, darkMode }) => {
  const [inputValue, setInputValue] = useState('');
  const [parsedInfo, setParsedInfo] = useState<{
    date: Date | null;
    priority: string | null;
  }>({ date: null, priority: null });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const processingTimeout = useRef<NodeJS.Timeout>();
  
  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Parse natural language input
  const parseNaturalLanguage = (input: string) => {
    let result = {
      text: input,
      date: null as Date | null,
      priority: null as string | null
    };
    
    // Extract date patterns
    const tomorrowMatch = input.match(/\btomorrow\b/i);
    const todayMatch = input.match(/\btoday\b/i);
    const nextWeekMatch = input.match(/\bnext week\b/i);
    const dateMatch = input.match(/\bon\s+(\d{1,2})[\/\-\.](\d{1,2})(?:[\/\-\.](\d{2,4}))?/i);
    
    if (tomorrowMatch) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      result.date = tomorrow;
    } else if (todayMatch) {
      result.date = new Date();
    } else if (nextWeekMatch) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      result.date = nextWeek;
    } else if (dateMatch) {
      try {
        const day = parseInt(dateMatch[1], 10);
        const month = parseInt(dateMatch[2], 10) - 1; // JS months are 0-indexed
        const year = dateMatch[3] ? parseInt(dateMatch[3], 10) : new Date().getFullYear();
        // Handle 2-digit years
        const fullYear = year < 100 ? 2000 + year : year;
        const date = new Date(fullYear, month, day);
        if (!isNaN(date.getTime())) {
          result.date = date;
        }
      } catch (e) {
        console.log('Date parsing error:', e);
      }
    }
    
    // Extract priority keywords
    const highPriorityMatch = input.match(/\b(urgent|high priority|important)\b/i);
    const mediumPriorityMatch = input.match(/\b(medium priority|normal)\b/i);
    const lowPriorityMatch = input.match(/\b(low priority|whenever|someday)\b/i);
    
    if (highPriorityMatch) {
      result.priority = 'High';
    } else if (mediumPriorityMatch) {
      result.priority = 'Medium';
    } else if (lowPriorityMatch) {
      result.priority = 'Low';
    }
    
    return result;
  };

  // Handle input change with debounced NLP processing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Clear any existing timeout to implement debouncing
    clearTimeout(processingTimeout.current);
    
    // Process after a short delay to avoid excessive processing during typing
    processingTimeout.current = setTimeout(() => {
      const parsedInput = parseNaturalLanguage(value);
      setParsedInfo({
        date: parsedInput.date,
        priority: parsedInput.priority
      });
    }, 300);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Create task with extracted information
    onCreateTask({
      title: inputValue,
      description: '',
      priority: parsedInfo.priority || 'Medium',
      dueDate: parsedInfo.date
    });
    
    // Clear input after creating task
    setInputValue('');
    setParsedInfo({ date: null, priority: null });
    
    // Return focus to input
    inputRef.current?.focus();
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="mb-4 w-full"
    >
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Add task using natural language (e.g., 'Call John tomorrow', 'Finish report urgent')"
          className="pr-24 py-6 text-base"
          autoComplete="off"
        />
        
        {/* Visual indicators for parsed information */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {parsedInfo.date && (
            <span className="inline-flex items-center bg-primary/20 text-primary px-2 py-1 rounded text-xs">
              <Calendar size={12} className="mr-1" />
              {parsedInfo.date.toLocaleDateString()}
            </span>
          )}
          
          {parsedInfo.priority && (
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
              parsedInfo.priority === 'High' ? 'bg-red-500/20 text-red-500' : 
              parsedInfo.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 
              'bg-green-500/20 text-green-500'
            }`}>
              <Flag size={12} className="mr-1" />
              {parsedInfo.priority}
            </span>
          )}
          
          <Button 
            type="submit" 
            size="sm"
            disabled={!inputValue.trim()}
            className="h-8 ml-1"
          >
            Add
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SmartTaskInput;
