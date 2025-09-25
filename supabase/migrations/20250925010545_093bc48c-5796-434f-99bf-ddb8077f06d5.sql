-- Create webhook_events table to fix signup errors
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  payload jsonb,
  created_at timestamp with time zone DEFAULT now(),
  processed_at timestamp with time zone,
  status text DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Create policies for webhook_events
CREATE POLICY "Service role can manage webhook events" 
ON public.webhook_events 
FOR ALL 
TO service_role 
USING (true);

-- Create function to handle new user signups (if not exists)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.webhook_events (event_type, payload)
  VALUES ('user.signup', jsonb_build_object('user_id', NEW.id, 'email', NEW.email));
  RETURN NEW;
END;
$$;

-- Create trigger for new user signups (if not exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();