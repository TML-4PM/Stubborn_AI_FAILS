
import { SupabaseClient } from '@supabase/supabase-js';

export const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000001';

export const createSystemUserIfNotExists = async (supabase: SupabaseClient) => {
  try {
    console.log('Checking if system user exists...');
    
    // Check if system user profile already exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', SYSTEM_USER_ID)
      .maybeSingle();

    if (profileError) {
      console.error('Error checking system user profile:', profileError);
      throw profileError;
    }

    if (existingProfile) {
      console.log('System user profile already exists');
      return existingProfile;
    }

    console.log('Creating system user profile...');
    
    // Create system user profile
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      .insert({
        user_id: SYSTEM_USER_ID,
        username: 'ai_discovery_system',
        full_name: 'AI Discovery System',
        bio: 'Automated AI fail discovery system'
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating system user profile:', createError);
      throw createError;
    }

    console.log('System user profile created successfully:', newProfile);
    return newProfile;
  } catch (error) {
    console.error('Failed to create system user:', error);
    throw error;
  }
};

export const getSystemUserId = () => SYSTEM_USER_ID;
