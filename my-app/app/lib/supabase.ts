import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

// import supabase url and anon key from .env file
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!; 
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!; 
// non-null assertion operator added to overcome
// "Typescript: Type 'string | undefined' is not assignable to type 'string'" error

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})