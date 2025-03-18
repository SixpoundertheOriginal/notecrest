
import { acquireTokenSilent } from '@/lib/microsoftAuth';

// Calendar event interface
export interface CalendarEvent {
  id: string;
  subject: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: {
    displayName: string;
  };
  bodyPreview?: string;
  isOnlineMeeting?: boolean;
  onlineMeetingUrl?: string;
}

// Fetch calendar events from Microsoft Graph API
export async function fetchCalendarEvents(
  startDate?: Date, 
  endDate?: Date
): Promise<CalendarEvent[]> {
  try {
    const accessToken = await acquireTokenSilent();
    
    if (!accessToken) {
      console.error('No access token available');
      return [];
    }
    
    // Default to fetching events for current week if no dates provided
    const start = startDate || new Date();
    const end = endDate || new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days ahead
    
    const startIso = start.toISOString();
    const endIso = end.toISOString();
    
    const url = `https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=${startIso}&endDateTime=${endIso}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch calendar events:', await response.text());
      return [];
    }
    
    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}

// Convert a calendar event to a task
export function convertEventToTask(event: CalendarEvent) {
  return {
    title: `📅 ${event.subject}`,
    description: event.bodyPreview || '',
    priority: 'Medium',
    date: new Date(event.start.dateTime).toISOString().split('T')[0],
    status: 'Todo',
    metadata: {
      isCalendarEvent: true,
      eventId: event.id,
      startTime: event.start.dateTime,
      endTime: event.end.dateTime,
      location: event.location?.displayName,
      isOnlineMeeting: event.isOnlineMeeting,
      onlineMeetingUrl: event.onlineMeetingUrl,
    }
  };
}
