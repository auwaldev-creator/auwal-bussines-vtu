import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://emsfczgikwhfjpgwkyqv.supabase.co'
const supabaseKey = 'sb_publishable_AuyN3-6VqWkMn11d1T_wmg_-RagFA47'

export const supabase = createClient(supabaseUrl, supabaseKey)
