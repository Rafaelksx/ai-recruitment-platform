'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createVacancy(formData: FormData) {
  const title = formData.get('title') as string;
  const department = formData.get('department') as string;
  const description = formData.get('description') as string;
  const location = formData.get('location') as string || 'Remote (Global)';
  const employment_type = formData.get('employment_type') as string || 'Full-time';
  const salary_range = formData.get('salary_range') as string || 'Competitivo';
  const responsibilitiesText = formData.get('responsibilities') as string || '';
  
  const responsibilities = responsibilitiesText
    .split('\n')
    .map(r => r.trim())
    .filter(r => r.length > 0);

  if (!title || !department || !description) {
    return { success: false, error: 'Los campos básicos (Título, Departamento, Descripción) son requeridos' };
  }

  const supabase = await createClient();
  
  // Get current user to link vacancy to company (for now just using user id if needed, though schema is simple)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'No autorizado' };
  }

  const { data, error } = await supabase
    .from('vacancies')
    .insert({
      title,
      department,
      description,
      location,
      employment_type,
      salary_range,
      responsibilities,
      status: 'active'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating vacancy:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/app/dashboard');
  revalidatePath('/careers', 'layout');
  return { success: true, data };
}

export async function closeVacancy(vacancyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'No autorizado' };
  }

  const { error } = await supabase
    .from('vacancies')
    .update({ status: 'closed' })
    .eq('id', vacancyId);

  if (error) {
    console.error('Error closing vacancy:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/app/dashboard');
  revalidatePath(`/app/vacancies/${vacancyId}/board`);
  revalidatePath('/careers', 'layout');
  return { success: true };
}
