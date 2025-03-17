
import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, Flag, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { parseTaskText, formatDate, formatTime } from '@/lib/nlp-parser';
import { cn } from '@/lib/utils';

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
    title: string;
    dueDate: Date | null;
    reminderTime: Date | null;
    priority: string | null;
  }>({ title: '', dueDate: null, reminderTime: null, priority: null });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const processingTimeout = useRef<NodeJS.Timeout>();
  
  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle input change with debounced NLP processing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Clear any existing timeout to implement debouncing
    clearTimeout(processingTimeout.current);
    
    // Process after a short delay to avoid excessive processing during typing
    processingTimeout.current = setTimeout(() => {
      if (value.trim()) {
        const parsedResult = parseTaskText(value);
        setParsedInfo({
          title: parsedResult.title,
          dueDate: parsedResult.dueDate || null,
          reminderTime: parsedResult.reminderTime || null,
          priority: parsedResult.priority || null
        });
      } else {
        setParsedInfo({ title: '', dueDate: null, reminderTime: null, priority: null });
      }
    }, 300);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If input is empty, open the detailed task creation sheet
    if (!inputValue.trim()) {
      onCreateTask({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: null
      });
      return;
    }
    
    // Create task with extracted information
    onCreateTask({
      title: parsedInfo.title || inputValue,
      description: '',
      priority: parsedInfo.priority || 'Medium',
      dueDate: parsedInfo.dueDate
    });
    
    // Clear input after creating task
    setInputValue('');
    setParsedInfo({ title: '', dueDate: null, reminderTime: null, priority: null });
    
    // Return focus to input
    inputRef.current?.focus();
  };

  return (
    <div className="w-full mb-2">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Add task... (e.g., 'Call John tomorrow', 'High priority: finish report')"
            className="py-5 pl-3 pr-20 text-sm rounded-lg shadow-sm bg-background/50 border-input/50"
            autoComplete="off"
          />
          
          {/* Subtle indicators for parsed information */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {parsedInfo.dueDate && (
              <span className="inline-flex items-center bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs">
                <Calendar size={10} className="mr-1" />
                {formatDate(parsedInfo.dueDate)}
              </span>
            )}
            
            {parsedInfo.reminderTime && (
              <span className="inline-flex items-center bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded text-xs">
                <Clock size={10} className="mr-1" />
                {formatTime(parsedInfo.reminderTime)}
              </span>
            )}
            
            {parsedInfo.priority && (
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${
                parsedInfo.priority === 'High' ? 'bg-red-500/10 text-red-400' : 
                parsedInfo.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' : 
                'bg-green-500/10 text-green-400'
              }`}>
                <Flag size={10} className="mr-1" />
                {parsedInfo.priority}
              </span>
            )}
            
            <Button 
              type="submit" 
              size="sm"
              className="h-7 px-2 text-xs ml-1 bg-primary/80 hover:bg-primary"
              aria-label="Add task"
            >
              {inputValue.trim() ? "Add" : "Details"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SmartTaskInput;
