
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pekzdexvwopdhlyrfbyb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBla3pkZXh2d29wZGhseXJmYnliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzM1NzgsImV4cCI6MjA2MjEwOTU3OH0.sarR4j0P2k8DVf-uIxcnSgrEcmXJmTHjTOrNUh2DVsM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
