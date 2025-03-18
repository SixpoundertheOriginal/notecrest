
CREATE TABLE IF NOT EXISTS public.calendar_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users,
  provider TEXT NOT NULL,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_connected BOOLEAN DEFAULT true,
  sync_preferences JSONB DEFAULT '{"syncAllCalendars": true, "syncTaskEvents": true, "syncFrequency": "hourly"}'::jsonb,
  UNIQUE(user_id, provider)
);

-- Add Row Level Security
ALTER TABLE public.calendar_connections ENABLE ROW LEVEL SECURITY;

-- Users can only view their own connections
CREATE POLICY "Users can view own calendar connections" ON public.calendar_connections 
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own connections
CREATE POLICY "Users can insert own calendar connections" ON public.calendar_connections 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own connections
CREATE POLICY "Users can update own calendar connections" ON public.calendar_connections 
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own connections
CREATE POLICY "Users can delete own calendar connections" ON public.calendar_connections 
  FOR DELETE USING (auth.uid() = user_id);
