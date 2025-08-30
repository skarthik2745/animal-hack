import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jfamksgjbqlesnjprnsx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYW1rc2dqYnFsZXNuanBybnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NjI0NzAsImV4cCI6MjA1MDUzODQ3MH0.placeholder_key_replace_with_actual'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase