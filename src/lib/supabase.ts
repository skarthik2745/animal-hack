import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tosgxxtnjbfaeyojpqsy.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc2d4eHRuamJmYWV5b2pwcXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NTk0NTMsImV4cCI6MjA3MjUzNTQ1M30.ru4k-xQp5mrgPxtX6d4VKO5HTei_SSZJP4kS8PZcwXk'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase