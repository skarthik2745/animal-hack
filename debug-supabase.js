// Debug Supabase connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tosgxxtnjbfaeyojpqsy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvc2d4eHRuamJmYWV5b2pwcXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NTk0NTMsImV4cCI6MjA3MjUzNTQ1M30.ru4k-xQp5mrgPxtX6d4VKO5HTei_SSZJP4kS8PZcwXk'

const supabase = createClient(supabaseUrl, supabaseKey)

// Test connection
async function testConnection() {
  console.log('Testing Supabase connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('events').select('count')
    console.log('Connection test:', { data, error })
    
    // Test insert
    const { data: insertData, error: insertError } = await supabase
      .from('events')
      .insert([{
        title: 'Debug Test Event',
        description: 'Test from debug script',
        start_date: new Date().toISOString(),
        location_address: 'Debug Location',
        is_free: true,
        attendees: 0
      }])
      .select()
    
    console.log('Insert test:', { insertData, insertError })
    
  } catch (e) {
    console.error('Error:', e)
  }
}

testConnection()