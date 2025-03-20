
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(
  supabaseUrl || 'https://example.com',  // Fallback for development
  supabaseAnonKey || 'placeholder-key'   // Fallback for development
);

// Initialize database with required tables and functions
export const initializeDatabase = async () => {
  // First, check if tables already exist
  const { data: existingTables, error: tablesError } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');
    
  if (tablesError) {
    console.error('Error checking existing tables:', tablesError);
    return;
  }
  
  const tableExists = (name: string) => {
    return existingTables?.some(t => t.table_name === name);
  };
  
  // Create profiles table if it doesn't exist
  if (!tableExists('profiles')) {
    const { error } = await supabase.rpc('create_profiles_table');
    if (error) console.error('Error creating profiles table:', error);
  }
  
  // Create submissions table if it doesn't exist
  if (!tableExists('submissions')) {
    const { error } = await supabase.rpc('create_submissions_table');
    if (error) console.error('Error creating submissions table:', error);
  }
  
  // Create likes table if it doesn't exist
  if (!tableExists('likes')) {
    const { error } = await supabase.rpc('create_likes_table');
    if (error) console.error('Error creating likes table:', error);
  }
  
  // Create comments table if it doesn't exist
  if (!tableExists('comments')) {
    const { error } = await supabase.rpc('create_comments_table');
    if (error) console.error('Error creating comments table:', error);
  }
  
  // Set up functions for likes count
  const { error: functionError } = await supabase.rpc('setup_like_functions');
  if (functionError) console.error('Error setting up like functions:', functionError);
  
  console.log('Database initialization completed');
};

// Create SQL Functions for Database Setup (executed via SQL Editor in Supabase Dashboard)
/*
-- Function to create profiles table
CREATE OR REPLACE FUNCTION create_profiles_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
  );
  
  -- Set up Row Level Security
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  
  -- Create policies
  CREATE POLICY "Public profiles are viewable by everyone" 
    ON profiles FOR SELECT USING (true);
    
  CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE USING (auth.uid() = id);
END;
$$ LANGUAGE plpgsql;

-- Function to create submissions table
CREATE OR REPLACE FUNCTION create_submissions_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    username TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending',
    likes INTEGER DEFAULT 0,
    category TEXT,
    tags TEXT[],
    ai_model TEXT
  );
  
  -- Set up Row Level Security
  ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
  
  -- Create policies
  CREATE POLICY "Approved submissions are viewable by everyone" 
    ON submissions FOR SELECT USING (status = 'approved');
    
  CREATE POLICY "Users can view their own submissions" 
    ON submissions FOR SELECT USING (auth.uid() = user_id);
    
  CREATE POLICY "Users can insert their own submissions" 
    ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
    
  CREATE POLICY "Users can update their own submissions" 
    ON submissions FOR UPDATE USING (auth.uid() = user_id);
END;
$$ LANGUAGE plpgsql;

-- Function to create likes table
CREATE OR REPLACE FUNCTION create_likes_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fail_id UUID REFERENCES submissions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(fail_id, user_id)
  );
  
  -- Set up Row Level Security
  ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
  
  -- Create policies
  CREATE POLICY "Users can view their own likes" 
    ON likes FOR SELECT USING (auth.uid() = user_id);
    
  CREATE POLICY "Users can insert their own likes" 
    ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
    
  CREATE POLICY "Users can delete their own likes" 
    ON likes FOR DELETE USING (auth.uid() = user_id);
END;
$$ LANGUAGE plpgsql;

-- Function to create comments table
CREATE OR REPLACE FUNCTION create_comments_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fail_id UUID REFERENCES submissions(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
  );
  
  -- Set up Row Level Security
  ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
  
  -- Create policies
  CREATE POLICY "Comments on approved submissions are viewable by everyone" 
    ON comments FOR SELECT 
    USING (
      EXISTS (
        SELECT 1 FROM submissions 
        WHERE submissions.id = fail_id 
        AND submissions.status = 'approved'
      )
    );
    
  CREATE POLICY "Users can insert their own comments" 
    ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
    
  CREATE POLICY "Users can update their own comments" 
    ON comments FOR UPDATE USING (auth.uid() = user_id);
    
  CREATE POLICY "Users can delete their own comments" 
    ON comments FOR DELETE USING (auth.uid() = user_id);
END;
$$ LANGUAGE plpgsql;

-- Function to set up like count functions
CREATE OR REPLACE FUNCTION setup_like_functions()
RETURNS void AS $$
BEGIN
  -- Function to increment likes
  CREATE OR REPLACE FUNCTION increment_likes(fail_id UUID)
  RETURNS void LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  BEGIN
    UPDATE submissions
    SET likes = likes + 1
    WHERE id = fail_id;
  END;
  $$;
  
  -- Function to decrement likes
  CREATE OR REPLACE FUNCTION decrement_likes(fail_id UUID)
  RETURNS void LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  BEGIN
    UPDATE submissions
    SET likes = GREATEST(0, likes - 1)
    WHERE id = fail_id;
  END;
  $$;
END;
$$ LANGUAGE plpgsql;
*/
