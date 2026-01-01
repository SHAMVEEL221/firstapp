import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gazxbvnlpeqyqujsvotx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdhenhidm5scGVxeXF1anN2b3R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNzAzMTYsImV4cCI6MjA2Njk0NjMxNn0.wlBQujIj04dKh3CbmPlVk3RcGdfgt4ExiPJarf-hZ50';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
