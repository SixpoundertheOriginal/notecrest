
// Helper types
type TaskPriority = "Low" | "Medium" | "High"; 

type ParsedTaskResult = {
  title: string;
  dueDate?: Date;
  reminderTime?: Date;
  priority?: TaskPriority;
};

export function parseTaskText(text: string): ParsedTaskResult {
  // Initialize result with the original text as title
  const result: ParsedTaskResult = {
    title: text
  };
  
  // Extract date information
  const dateInfo = extractDateInfo(text);
  if (dateInfo.dueDate) {
    result.dueDate = dateInfo.dueDate;
    // Remove the date part from the title
    result.title = result.title.replace(dateInfo.dateText, "").trim();
  }
  
  // Extract time information
  const timeInfo = extractTimeInfo(text);
  if (timeInfo.reminderTime) {
    result.reminderTime = timeInfo.reminderTime;
    // Remove the time part from the title
    result.title = result.title.replace(timeInfo.timeText, "").trim();
  }
  
  // Extract priority information
  const priorityInfo = extractPriorityInfo(text);
  if (priorityInfo.priority) {
    result.priority = priorityInfo.priority;
    // Remove the priority part from the title
    result.title = result.title.replace(priorityInfo.priorityText, "").trim();
  }
  
  // Clean up any remaining artifacts
  result.title = cleanupTitle(result.title);
  
  return result;
}

function extractDateInfo(text: string): { dueDate?: Date, dateText: string } {
  // Initialize result
  const result = { dueDate: undefined as Date | undefined, dateText: "" };
  
  // Check for days of the week (Monday, Tuesday, etc.)
  const dayNames = [
    { full: "sunday", short: "sun", offset: 0 },
    { full: "monday", short: "mon", offset: 1 },
    { full: "tuesday", short: "tue", offset: 2 },
    { full: "wednesday", short: "wed", offset: 3 },
    { full: "thursday", short: "thu", offset: 4 },
    { full: "friday", short: "fri", offset: 5 },
    { full: "saturday", short: "sat", offset: 6 }
  ];
  
  // Create a regex pattern for all day variations (including common misspellings)
  const dayVariations = dayNames.flatMap(day => [
    day.full, day.short, 
    day.full.replace("day", "dai"), // Common misspelling: "wednesdai"
    day.full.replace("day", "dy"), // Common misspelling: "wednesdy"
    day.full.replace("nes", "ned"), // Common misspelling: "wednedsday"
    day.full.replace("es", "ed")  // Common misspelling: "wedneday"
  ]);
  
  const dayPattern = new RegExp(`\\b(${dayVariations.join("|")})\\b`, "i");
  const dayMatch = text.match(dayPattern);
  
  if (dayMatch) {
    const matchedDay = dayMatch[1].toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Find which day was matched (accounting for variations/misspellings)
    let targetDay = -1;
    for (const day of dayNames) {
      if (
        matchedDay === day.full || 
        matchedDay === day.short ||
        matchedDay.includes(day.full.substring(0, 3))
      ) {
        targetDay = day.offset;
        break;
      }
    }
    
    if (targetDay >= 0) {
      // Calculate the next occurrence of the specified day
      const daysToAdd = (targetDay + 7 - currentDayOfWeek) % 7;
      const nextOccurrence = new Date(today);
      nextOccurrence.setDate(today.getDate() + (daysToAdd === 0 ? 7 : daysToAdd));
      
      result.dueDate = nextOccurrence;
      result.dateText = dayMatch[0];
      return result;
    }
  }
  
  // Check for "tomorrow"
  const tomorrowMatch = text.match(/\b(tomorrow)\b/i);
  if (tomorrowMatch) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Reset time part
    result.dueDate = tomorrow;
    result.dateText = tomorrowMatch[0];
    return result;
  }
  
  // Check for "today"
  const todayMatch = text.match(/\b(today)\b/i);
  if (todayMatch) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part
    result.dueDate = today;
    result.dateText = todayMatch[0];
    return result;
  }
  
  // Check for "next week"
  const nextWeekMatch = text.match(/\b(next week)\b/i);
  if (nextWeekMatch) {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(0, 0, 0, 0); // Reset time part
    result.dueDate = nextWeek;
    result.dateText = nextWeekMatch[0];
    return result;
  }
  
  // Check for dates like "March 17" or "Mar 17"
  const monthDateMatch = text.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* (\d{1,2})(st|nd|rd|th)?\b/i);
  if (monthDateMatch) {
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const monthText = monthDateMatch[1].toLowerCase();
    const monthIndex = monthNames.findIndex(m => m === monthText.substring(0, 3));
    
    if (monthIndex !== -1) {
      const day = parseInt(monthDateMatch[2], 10);
      const date = new Date();
      
      // Set the date (handling year rollover)
      const currentMonth = date.getMonth();
      if (monthIndex < currentMonth) {
        // If the month is before the current month, assume next year
        date.setFullYear(date.getFullYear() + 1);
      }
      
      date.setMonth(monthIndex);
      date.setDate(day);
      date.setHours(0, 0, 0, 0); // Reset time part
      
      result.dueDate = date;
      result.dateText = monthDateMatch[0];
      return result;
    }
  }
  
  // Check for numeric dates like "03/17" or "3/17"
  const numericDateMatch = text.match(/\b(\d{1,2})\/(\d{1,2})(?:\/\d{2,4})?\b/);
  if (numericDateMatch) {
    const month = parseInt(numericDateMatch[1], 10) - 1; // JS months are 0-based
    const day = parseInt(numericDateMatch[2], 10);
    
    // Validate month and day
    if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
      const date = new Date();
      
      // Handle year rollover
      if (month < date.getMonth()) {
        date.setFullYear(date.getFullYear() + 1);
      }
      
      date.setMonth(month);
      date.setDate(day);
      date.setHours(0, 0, 0, 0); // Reset time part
      
      result.dueDate = date;
      result.dateText = numericDateMatch[0];
      return result;
    }
  }
  
  return result;
}

function extractTimeInfo(text: string): { reminderTime?: Date, timeText: string } {
  // Initialize result
  const result = { reminderTime: undefined as Date | undefined, timeText: "" };
  
  // Look for time patterns like "at 3pm", "at 15:00", "at 3:30pm"
  const timeMatch = text.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const period = timeMatch[3] ? timeMatch[3].toLowerCase() : null;
    
    // Adjust hours for am/pm
    if (period === "pm" && hours < 12) {
      hours += 12;
    } else if (period === "am" && hours === 12) {
      hours = 0;
    }
    
    // Create a date object with the parsed time
    const time = new Date();
    time.setHours(hours, minutes, 0, 0);
    
    result.reminderTime = time;
    result.timeText = timeMatch[0];
    return result;
  }
  
  // Look for common time indicators
  const timeIndicators = [
    { pattern: /\bmorning\b/i, hours: 9, minutes: 0 },
    { pattern: /\bnoon\b/i, hours: 12, minutes: 0 },
    { pattern: /\bafternoon\b/i, hours: 15, minutes: 0 },
    { pattern: /\bevening\b/i, hours: 18, minutes: 0 },
    { pattern: /\bnight\b/i, hours: 20, minutes: 0 },
  ];
  
  for (const indicator of timeIndicators) {
    const match = text.match(indicator.pattern);
    if (match) {
      const time = new Date();
      time.setHours(indicator.hours, indicator.minutes, 0, 0);
      
      result.reminderTime = time;
      result.timeText = match[0];
      return result;
    }
  }
  
  return result;
}

function extractPriorityInfo(text: string): { priority?: TaskPriority, priorityText: string } {
  // Initialize result
  const result = { priority: undefined as TaskPriority | undefined, priorityText: "" };
  
  // Look for high priority indicators
  const highPriorityMatch = text.match(/\b(urgent|high priority|important|asap)\b/i);
  if (highPriorityMatch) {
    result.priority = "High";
    result.priorityText = highPriorityMatch[0];
    return result;
  }
  
  // Look for low priority indicators
  const lowPriorityMatch = text.match(/\b(low priority|whenever|not urgent|someday)\b/i);
  if (lowPriorityMatch) {
    result.priority = "Low";
    result.priorityText = lowPriorityMatch[0];
    return result;
  }
  
  // Look for medium priority indicators
  const mediumPriorityMatch = text.match(/\b(medium priority|normal)\b/i);
  if (mediumPriorityMatch) {
    result.priority = "Medium";
    result.priorityText = mediumPriorityMatch[0];
    return result;
  }
  
  return result;
}

function cleanupTitle(title: string): string {
  // Remove common prepositions at the beginning or end
  title = title.replace(/^(to|for|on|at|by)\s+/i, "");
  title = title.replace(/\s+(to|for|on|at|by)$/i, "");
  
  // Replace multiple spaces with a single space
  title = title.replace(/\s+/g, " ");
  
  return title.trim();
}

// Utility functions for formatting
export function formatDate(date: Date): string {
  // Format date as "Today", "Tomorrow", or "Mon, Mar 17"
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.getTime() === today.getTime()) {
    return "Today";
  } else if (date.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  } else {
    const options: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  }
}

export function formatTime(date: Date): string {
  // Format time as "3:00 PM"
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}
