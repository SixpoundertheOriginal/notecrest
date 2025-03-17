
import { useRef } from 'react';

export interface NLPResult {
  title: string;
  date: Date | null;
  priority: string | null;
}

export const useTaskInputNLP = (
  setTitle: (value: string) => void,
  setDueDate: (date: Date | null) => void,
  setPriority: (priority: string) => void
) => {
  const nlpTimeout = useRef<NodeJS.Timeout>();

  // NLP parsing function to extract date, time and priority
  const parseNaturalLanguage = (input: string): NLPResult => {
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

  return {
    handleTitleInput
  };
};
