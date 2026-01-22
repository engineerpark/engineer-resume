import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// TEMPORARY: Mock user ID for testing without auth
const MOCK_USER_ID = '00000000-0000-0000-0000-000000000001';
const USE_MOCK_AUTH = true; // Set to false to enable real auth

export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}

export async function getSession() {
  if (USE_MOCK_AUTH) {
    return { user: { id: MOCK_USER_ID, email: 'test@test.com' } };
  }

  const supabase = createServerSupabaseClient();
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function getUser() {
  if (USE_MOCK_AUTH) {
    return { id: MOCK_USER_ID, email: 'test@test.com' } as any;
  }

  const supabase = createServerSupabaseClient();
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}
