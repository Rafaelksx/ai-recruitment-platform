'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveCandidateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'No autenticado' };

  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const phone = formData.get('phone') as string;
  const linkedin = formData.get('linkedin') as string;
  const portfolio = formData.get('portfolio') as string;
  const summary = formData.get('summary') as string;

  // Update user metadata (name)
  if (firstName || lastName) {
    await supabase.auth.updateUser({
      data: {
        full_name: [firstName, lastName].filter(Boolean).join(' '),
      }
    });
  }

  // Upsert into profiles table
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      role: 'candidate',
      phone,
      linkedin_url: linkedin,
      portfolio_url: portfolio,
      bio: summary,
    });

  if (error) {
    // If columns don't exist yet (schema not updated), just return success
    console.error('Profile upsert error (may need migration):', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/portal/profile');
  return { success: true };
}
