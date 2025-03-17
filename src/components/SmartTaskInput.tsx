
import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, Flag, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { parseTaskText, formatDate, formatTime } from '@/lib/nlp-parser';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [isPressed, setIsPressed] = useState(false);
  
  const isMobile = useIsMobile();
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
        console.log('Parsed result:', parsedResult); // Debug log
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
    
    if (!inputValue.trim()) return;
    
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

  // Handle the advanced task button click
  const handleAdvancedTaskClick = () => {
    // If there's text in the input, pre-fill the advanced form by creating a basic task
    if (inputValue.trim()) {
      handleSubmit(new Event('submit') as unknown as React.FormEvent);
    }
    
    // Trigger the advanced task creation flow
    onCreateTask({
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: null
    });
  };

  return (
    <div className="mb-4 w-full space-y-2">
      <form 
        onSubmit={handleSubmit}
        className="w-full"
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
            {parsedInfo.dueDate && (
              <span className="inline-flex items-center bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                <Calendar size={12} className="mr-1" />
                {formatDate(parsedInfo.dueDate)}
              </span>
            )}
            
            {parsedInfo.reminderTime && (
              <span className="inline-flex items-center bg-blue-500/20 text-blue-500 px-2 py-1 rounded text-xs">
                <Clock size={12} className="mr-1" />
                {formatTime(parsedInfo.reminderTime)}
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
      
      {/* Enhanced Add Task Button */}
      <Button 
        onClick={handleAdvancedTaskClick}
        className={cn(
          "w-full bg-blue-500/90 hover:bg-blue-600/90 text-white py-2.5 sm:py-3 rounded-lg transition-all duration-200 group relative overflow-hidden",
          isPressed ? 'scale-[0.98]' : ''
        )}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
      >
        {/* Add subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Add subtle inner shadow for depth */}
        <div className="absolute inset-0 shadow-inner shadow-blue-300/10" />
        
        <Plus size={isMobile ? 16 : 18} className="mr-2" />
        <span>Create Detailed Task</span>
      </Button>
    </div>
  );
};

export default SmartTaskInput;
