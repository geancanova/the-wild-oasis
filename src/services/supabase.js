import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://nszmxknhlkqzbbvfoxug.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zem14a25obGtxemJidmZveHVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY2NDY2OTAsImV4cCI6MjAyMjIyMjY5MH0.Ys0fG4pDMXQUH4xEOYtBaw42FaZ1a8uyDBqInueCAIw";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
