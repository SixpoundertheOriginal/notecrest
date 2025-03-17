
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobileValue } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import HighlightedTaskInput from './task-input/HighlightedTaskInput';

interface SmartTaskInputProps {
  onCreateTask: (task: {
    title: string;
    description: string;
    priority: string;
    dueDate: Date | null;
  }) => void;
  darkMode: boolean;
}

// Example placeholder texts to showcase NLP capabilities
const PLACEHOLDER_EXAMPLES = [
  "Quick add with NLP... (e.g., 'Call John tomorrow', 'High priority: finish report')",
  "Try 'Submit project by Friday at 5pm'",
  "Try 'Grocery shopping tomorrow morning'",
  "Try 'Urgent: prepare presentation for Monday'"
];

const SmartTaskInput: React.FC<SmartTaskInputProps> = ({ onCreateTask, darkMode }) => {
  const [inputValue, setInputValue] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const isMobile = useIsMobileValue();
  
  // Set up interval to rotate placeholder examples
  React.useEffect(() => {
    // Don't cycle placeholders on mobile to save space
    if (isMobile) return;
    
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_EXAMPLES.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [isMobile]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      return;
    }
    
    // Use the current NLP parsing to extract information
    import('@/lib/nlp-parser').then(({ parseTaskText }) => {
      const parsedInfo = parseTaskText(inputValue);
      
      onCreateTask({
        title: parsedInfo.title || inputValue,
        description: '',
        priority: parsedInfo.priority || 'Medium',
        dueDate: parsedInfo.dueDate
      });
      
      // Clear input after creating task
      setInputValue('');
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const currentPlaceholder = isMobile 
    ? "Quick add with NLP..." 
    : PLACEHOLDER_EXAMPLES[placeholderIndex];

  return (
    <div className="w-full mb-2">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <HighlightedTaskInput
            value={inputValue}
            onChange={setInputValue}
            onKeyDown={handleKeyDown}
            placeholder={currentPlaceholder}
            darkMode={darkMode}
            className="pr-20"
            autoFocus
          />
          
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Button 
              type="submit" 
              size="sm"
              className={cn(
                "h-7 text-xs ml-1 bg-primary/80 hover:bg-primary",
                isMobile ? "px-3 min-w-[60px]" : "px-2"
              )}
              aria-label="Add task"
              disabled={!inputValue.trim()}
            >
              Add
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SmartTaskInput;
