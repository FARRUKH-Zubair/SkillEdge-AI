import { createClient } from '@supabase/supabase-js';

// Update credentials with the latest values
const url = 'https://uzcipgmeuqilktbwodls.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6Y2lwZ21ldXFpbGt0YndvZGxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NDQ4MDcsImV4cCI6MjA2MzQyMDgwN30.LHmhCH9UBtRDMX_OzJ_dF_1lh7Oz_opuUMt1qt39URs';

// Create the Supabase client with options
export const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

// Utility function to get a user's profile
export async function getProfile(userId) {
  try {
    // First check if the table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);

    if (tableError) {
      console.error('Error checking profiles table:', tableError.message);
      return null;
    }

    // Then try to get the profile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors if no record is found

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting profile:', error.message);
    return null;
  }
}

// Utility function to update a user's profile
export async function updateProfile(userId, profileData) {
  try {
    // Check if the table exists first
    const { data: tableExists, error: tableError } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);

    if (tableError && tableError.code === '42P01') {
      console.error('Profiles table does not exist. Please run the SQL setup script.');
      throw new Error('Profiles table does not exist. Please run the SQL setup script.');
    }

    // Format the data to match the actual column names in Supabase
    const formattedData = {
      // Map our application field names to the actual column names in Supabase
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      industry: profileData.industry,
      bio: profileData.bio,
      experience: profileData.experience,
      skills: profileData.skills || [],
      updated_at: new Date().toISOString(),
    };

    // Check if profile exists
    const existingProfile = await getProfile(userId);

    if (existingProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('profiles')
        .update(formattedData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({ ...formattedData, user_id: userId })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error updating profile:', error.message);
    throw error;
  }
} 