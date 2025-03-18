
import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Flag, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseTaskText, formatDate, formatTime } from '@/lib/nlp-parser';

interface HighlightedTaskInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  darkMode: boolean;
  className?: string;
  autoFocus?: boolean;
}

interface Token {
  text: string;
  type: 'text' | 'date' | 'time' | 'priority' | 'project';
  startIndex: number;
  endIndex: number;
}

const HighlightedTaskInput: React.FC<HighlightedTaskInputProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  darkMode,
  className,
  autoFocus = false
}) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [parsedInfo, setParsedInfo] = useState<ReturnType<typeof parseTaskText>>({
    title: value,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const processingTimeout = useRef<NodeJS.Timeout>();
  
  // Focus input on component mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Parse text and extract tokens when input changes
  useEffect(() => {
    // Clear any existing timeout
    clearTimeout(processingTimeout.current);
    
    // Process after a short delay to avoid excessive processing during typing
    processingTimeout.current = setTimeout(() => {
      if (value.trim()) {
        // Parse the input text
        const result = parseTaskText(value);
        setParsedInfo(result);
        
        // Extract tokens and their positions from the input text
        const newTokens: Token[] = [];
        let currentText = value;
        let startIndex = 0;
        
        // Extract date tokens
        if (result.dueDate) {
          // Find date patterns in the original text
          const datePatterns = [
            /\b(tomorrow|today|next week)\b/i,
            /\b(sun|mon|tue|wed|thu|fri|sat|sunday|monday|tuesday|wednesday|thursday|friday|saturday)\b/i,
            /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* (\d{1,2})(st|nd|rd|th)?\b/i,
            /\b(\d{1,2})\/(\d{1,2})(?:\/\d{2,4})?\b/
          ];
          
          for (const pattern of datePatterns) {
            const match = currentText.match(pattern);
            if (match && match.index !== undefined) {
              newTokens.push({
                text: match[0],
                type: 'date',
                startIndex: match.index,
                endIndex: match.index + match[0].length
              });
              break; // Stop after finding the first date match
            }
          }
        }
        
        // Extract time tokens
        if (result.reminderTime) {
          // Find time patterns in the original text
          const timePatterns = [
            /\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i,
            /\b(morning|noon|afternoon|evening|night)\b/i
          ];
          
          for (const pattern of timePatterns) {
            const match = currentText.match(pattern);
            if (match && match.index !== undefined) {
              newTokens.push({
                text: match[0],
                type: 'time',
                startIndex: match.index,
                endIndex: match.index + match[0].length
              });
              break; // Stop after finding the first time match
            }
          }
        }
        
        // Extract priority tokens
        if (result.priority) {
          // Find priority patterns in the original text
          const priorityPatterns = [
            /\b(urgent|high priority|important|asap)\b/i,
            /\b(medium priority|normal)\b/i,
            /\b(low priority|whenever|not urgent|someday)\b/i
          ];
          
          for (const pattern of priorityPatterns) {
            const match = currentText.match(pattern);
            if (match && match.index !== undefined) {
              newTokens.push({
                text: match[0],
                type: 'priority',
                startIndex: match.index,
                endIndex: match.index + match[0].length
              });
              break; // Stop after finding the first priority match
            }
          }
        }
        
        // Sort tokens by their start index to preserve order
        newTokens.sort((a, b) => a.startIndex - b.startIndex);
        setTokens(newTokens);
      } else {
        setParsedInfo({ title: '' });
        setTokens([]);
      }
    }, 300); // 300ms debounce
  }, [value]);

  // Render highlighted input
  const renderHighlightedInput = () => {
    // If there are no tokens or the input is empty, just return the plain input
    if (tokens.length === 0 || !value.trim()) {
      return (
        <input
          ref={inputRef}
          type="text"
          className={cn(
            "w-full py-5 px-3 text-sm rounded-lg shadow-sm bg-background/50 border-input/50",
            className
          )}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete="off"
        />
      );
    }

    // Create highlighted elements
    let lastIndex = 0;
    const elements: JSX.Element[] = [];

    // Add each token with its appropriate highlight
    tokens.forEach((token, i) => {
      // Add text before the token
      if (token.startIndex > lastIndex) {
        elements.push(
          <span key={`text-${i}`}>
            {value.slice(lastIndex, token.startIndex)}
          </span>
        );
      }

      // Add the highlighted token
      const tokenClass = cn(
        "px-1 rounded-sm",
        token.type === 'date' && 'bg-blue-500/20 text-blue-300',
        token.type === 'time' && 'bg-purple-500/20 text-purple-300',
        token.type === 'priority' && 
          (token.text.match(/urgent|high/i) 
            ? 'bg-[#D946EF]/20 text-[#D946EF]'
            : token.text.match(/low|whenever|someday/i)
              ? 'bg-[#0EA5E9]/20 text-[#0EA5E9]'
              : 'bg-[#8B5CF6]/20 text-[#8B5CF6]'),
        token.type === 'project' && 'bg-indigo-500/20 text-indigo-300'
      );

      elements.push(
        <span key={`token-${i}`} className={tokenClass}>
          {token.text}
        </span>
      );

      lastIndex = token.endIndex;
    });

    // Add text after the last token
    if (lastIndex < value.length) {
      elements.push(
        <span key="text-end">
          {value.slice(lastIndex)}
        </span>
      );
    }

    // Create a styled div that looks like an input but contains highlighted content
    return (
      <div className="relative">
        <div
          className={cn(
            "w-full py-5 px-3 text-sm rounded-lg shadow-sm bg-background/50 border border-input/50 min-h-[52px]",
            "focus-within:ring-1 focus-within:ring-ring",
            className
          )}
        >
          <div className="flex flex-wrap gap-1">{elements}</div>
        </div>
        <input
          ref={inputRef}
          type="text"
          className="opacity-0 absolute top-0 left-0 w-full h-full cursor-text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete="off"
        />
      </div>
    );
  };

  // Render entity summary
  const renderEntitySummary = () => {
    if (!value.trim() || (!parsedInfo.dueDate && !parsedInfo.reminderTime && !parsedInfo.priority)) {
      return null;
    }

    return (
      <div className={cn(
        "flex flex-wrap items-center gap-2 mt-2 text-xs transition-opacity duration-200",
        darkMode ? "text-gray-400" : "text-gray-600"
      )}>
        {parsedInfo.dueDate && (
          <span className="inline-flex items-center bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">
            <Calendar size={12} className="mr-1" />
            {formatDate(parsedInfo.dueDate)}
          </span>
        )}
        
        {parsedInfo.reminderTime && (
          <span className="inline-flex items-center bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded">
            <Clock size={12} className="mr-1" />
            {formatTime(parsedInfo.reminderTime)}
          </span>
        )}
        
        {parsedInfo.priority && (
          <span className={cn(
            "inline-flex items-center px-1.5 py-0.5 rounded",
            parsedInfo.priority === "High" 
              ? "bg-[#D946EF]/10 text-[#D946EF]" 
              : parsedInfo.priority === "Medium" 
                ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" 
                : "bg-[#0EA5E9]/10 text-[#0EA5E9]"
          )}>
            <Flag size={12} className="mr-1" />
            {parsedInfo.priority}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      {renderHighlightedInput()}
      {renderEntitySummary()}
    </div>
  );
};

export default HighlightedTaskInput;
