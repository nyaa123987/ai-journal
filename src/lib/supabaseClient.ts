import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nxfytsystcufgnzvrmes.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54Znl0c3lzdGN1ZmduenZybWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3MDAxMTUsImV4cCI6MjA3MTI3NjExNX0.dVPB8GLh6oGEx2tRCbjhV3gmo0j_OlR6GOU0RHuoaUs'
);
