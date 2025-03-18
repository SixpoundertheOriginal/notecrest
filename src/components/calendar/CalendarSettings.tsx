
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ConnectCalendarButton from '@/components/calendar/ConnectCalendarButton';
import { getActiveAccount, signOutFromMicrosoft } from '@/lib/microsoftAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const CalendarSettings = () => {
  const [syncAllCalendars, setSyncAllCalendars] = useState(true);
  const [syncTaskEvents, setSyncTaskEvents] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState('hourly');
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if user has connected calendar
  useEffect(() => {
    const checkConnection = async () => {
      if (!user) return;

      // Check MSAL connection
      const account = getActiveAccount();
      
      // Just use the MSAL account for now until the table is created
      setIsConnected(!!account);
    };
    
    checkConnection();
  }, [user]);

  const handleDisconnect = async () => {
    try {
      await signOutFromMicrosoft();
      
      setIsConnected(false);
      toast({
        title: "Calendar disconnected",
        description: "Your Microsoft calendar has been disconnected",
      });
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect your calendar",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Calendar Settings</h2>
      <p className="text-muted-foreground">
        Connect and manage your calendar integrations to sync events with your tasks.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Microsoft Calendar</CardTitle>
          <CardDescription>
            Connect your Microsoft Outlook calendar to see your meetings alongside your tasks.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="font-medium">Connection Status</h4>
              <p className="text-sm text-muted-foreground">
                {isConnected 
                  ? "Your Microsoft calendar is currently connected" 
                  : "Connect your Microsoft calendar to get started"}
              </p>
            </div>
            {isConnected ? (
              <Button variant="outline" onClick={handleDisconnect}>
                Disconnect
              </Button>
            ) : (
              <ConnectCalendarButton />
            )}
          </div>

          {isConnected && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium">Sync Settings</h4>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sync-all">Sync all calendars</Label>
                    <p className="text-sm text-muted-foreground">
                      Include all your Microsoft calendars
                    </p>
                  </div>
                  <Switch 
                    id="sync-all" 
                    checked={syncAllCalendars}
                    onCheckedChange={setSyncAllCalendars}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sync-tasks">Convert meetings to tasks</Label>
                    <p className="text-sm text-muted-foreground">
                      Create tasks from calendar events
                    </p>
                  </div>
                  <Switch 
                    id="sync-tasks" 
                    checked={syncTaskEvents}
                    onCheckedChange={setSyncTaskEvents}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sync-frequency">Sync frequency</Label>
                  <select
                    id="sync-frequency"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={syncFrequency}
                    onChange={(e) => setSyncFrequency(e.target.value)}
                  >
                    <option value="realtime">Real-time</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarSettings;
