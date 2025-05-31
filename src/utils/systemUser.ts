
export const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';

export const createSystemUserIfNotExists = async (supabase: any) => {
  // Check if system user profile exists
  const { data: existingProfile, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', SYSTEM_USER_ID)
    .single();

  if (!existingProfile && !error?.message?.includes('PGRST116')) {
    // Create system user profile
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        user_id: SYSTEM_USER_ID,
        username: 'ai_discovery_system',
        full_name: 'AI Discovery System',
        bio: 'Automated content discovery system'
      });

    if (insertError) {
      console.error('Error creating system user profile:', insertError);
    }
  }
};

export const isSystemUser = (userId: string): boolean => {
  return userId === SYSTEM_USER_ID;
};
