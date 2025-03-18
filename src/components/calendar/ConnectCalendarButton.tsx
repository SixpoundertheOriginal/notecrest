
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Loader2 } from 'lucide-react';
import { signInWithMicrosoft, getActiveAccount } from '@/lib/microsoftAuth';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const ConnectCalendarButton = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(!!getActiveAccount());
  const { toast } = useToast();
  const { user } = useAuth();

  const handleConnect = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to connect your calendar",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      const response = await signInWithMicrosoft();
      
      if (response && response.accessToken) {
        // Store connection info in local state for now until the table is created
        setIsConnected(true);
        toast({
          title: "Calendar connected!",
          description: "Your Microsoft calendar has been connected successfully",
        });
      }
    } catch (error) {
      console.error('Calendar connection error:', error);
      toast({
        title: "Connection failed",
        description: "Could not connect to Microsoft calendar",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button 
      onClick={handleConnect} 
      disabled={isConnecting || isConnected}
      className="w-full sm:w-auto"
    >
      {isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : isConnected ? (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          Calendar Connected
        </>
      ) : (
        <>
          <Calendar className="mr-2 h-4 w-4" />
          Connect Microsoft Calendar
        </>
      )}
    </Button>
  );
};

export default ConnectCalendarButton;
