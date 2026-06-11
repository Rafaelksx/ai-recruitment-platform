'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return { ...data, email: user.email };
}

export async function updateUserRole(newRole: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'No autorizado' };

  // Update profile role
  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', user.id);

  if (error) {
    console.error('Error updating role:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/app/settings');
  revalidatePath('/app/dashboard');
  return { success: true };
}
