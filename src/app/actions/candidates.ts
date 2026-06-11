'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getCandidatesByVacancy(vacancyId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('vacancy_id', vacancyId)
    .order('ai_score', { ascending: false });

  if (error) {
    console.error('Error fetching candidates:', error);
    return [];
  }

  return data;
}

export async function updateCandidateStatus(candidateId: string, newStatus: string, vacancyId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('candidates')
    .update({ status: newStatus })
    .eq('id', candidateId);

  if (error) {
    console.error('Error updating candidate status:', error);
    return { success: false, error: error.message };
  }

  // Trigger n8n webhook if configured (plug-and-play when n8n is ready)
  if (process.env.N8N_WEBHOOK_URL) {
    try {
      // Fetch candidate email for the notification
      const { data: candidate } = await supabase
        .from('candidates')
        .select('first_name, last_name, email')
        .eq('id', candidateId)
        .single();

      await fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId,
          vacancyId,
          newStatus,
          candidateName: candidate ? `${candidate.first_name} ${candidate.last_name}` : '',
          candidateEmail: candidate?.email || '',
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (webhookError) {
      // Non-blocking — don't fail if webhook fails
      console.error('n8n webhook error (non-blocking):', webhookError);
    }
  }

  // Revalidate the board page so it reflects the new state on next load
  revalidatePath(`/app/vacancies/${vacancyId}/board`);
  return { success: true };
}

export async function saveCandidateNote(candidateId: string, note: string, vacancyId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'No autorizado' };

  const { error } = await supabase
    .from('candidates')
    .update({ recruiter_notes: note })
    .eq('id', candidateId);

  if (error) {
    console.error('Error saving note:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/app/vacancies/${vacancyId}/board`);
  return { success: true };
}

export async function rejectCandidate(candidateId: string, vacancyId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('candidates')
    .update({ status: 'rejected' })
    .eq('id', candidateId);

  if (error) {
    console.error('Error rejecting candidate:', error);
    return { success: false, error: error.message };
  }

  revalidatePath(`/app/vacancies/${vacancyId}/board`);
  return { success: true };
}

export async function getVacancyDetails(vacancyId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('vacancies')
    .select('*')
    .eq('id', vacancyId)
    .single();

  if (error) {
    console.error('Error fetching vacancy:', error);
    return null;
  }

  return data;
}

export async function getCandidateDetails(candidateId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('candidates')
    .select(`
      *,
      vacancies (
        title,
        department
      )
    `)
    .eq('id', candidateId)
    .single();

  if (error) {
    console.error('Error fetching candidate details:', error);
    return null;
  }

  return data;
}

export async function getAllCandidates() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('candidates')
    .select(`
      *,
      vacancies (
        title
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all candidates:', error);
    return [];
  }

  return data;
}

export async function applyToVacancy(formData: FormData) {
  const supabase = await createClient();
  
  const vacancyId = formData.get('vacancyId') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const cvFile = formData.get('cv') as File | null;

  if (!vacancyId || !firstName || !lastName || !email || !cvFile) {
    return { success: false, error: 'Todos los campos básicos y el CV son requeridos' };
  }

  // 1. Fetch Vacancy Details for AI context
  const { data: vacancyData } = await supabase
    .from('vacancies')
    .select('title, description')
    .eq('id', vacancyId)
    .single();

  if (!vacancyData) {
    return { success: false, error: 'Vacante no encontrada' };
  }

  // 2. Upload PDF to Supabase Storage
  // Ensure bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.name === 'cv_uploads')) {
    await supabase.storage.createBucket('cv_uploads', { public: true });
  }

  const fileExt = cvFile.name.split('.').pop();
  const fileName = `${Date.now()}_${firstName}_${lastName}.${fileExt}`;
  
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('cv_uploads')
    .upload(fileName, cvFile, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('Error uploading CV:', uploadError);
    // Continue even if upload fails so candidate isn't lost, just proceed without PDF
  }

  // 3. Parse PDF to Text
  let cvText = "No se pudo extraer texto del CV.";
  try {
    const arrayBuffer = await cvFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Polyfill DOMMatrix for pdf.js running in Node/Next.js
    if (typeof global.DOMMatrix === 'undefined') {
      (global as any).DOMMatrix = class DOMMatrix {
        constructor() {}
      };
    }

    // Import dynamically so it works in Server Actions
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse(uint8Array);
    await (parser as any).load();
    const result = await (parser as any).getText();
    cvText = result.text;
  } catch (err) {
    console.error('Error parsing PDF:', err);
  }

  // 4. Send to Gemini for Evaluation
  // Import AI function
  const { parseCVWithGemini } = await import('@/lib/ai');
  const aiResults = await parseCVWithGemini(cvText, vacancyData.title, vacancyData.description);

  // 5. Insert Candidate with AI Results
  const { data, error } = await supabase
    .from('candidates')
    .insert({
      vacancy_id: vacancyId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      status: 'new', // First column of the Kanban
      ai_score: aiResults.ai_score,
      ai_summary: aiResults.ai_summary,
      ai_insights: {
        strengths: aiResults.strengths,
        gaps: aiResults.gaps,
        soft_skills: aiResults.soft_skills
      },
      resume_url: fileName

    })
    .select()
    .single();

  if (error) {
    console.error('Error creating candidate application:', error);
    return { success: false, error: error.message };
  }

  // Trigger N8N webhook for NEW application
  if (process.env.N8N_WEBHOOK_URL_NEW_APP) {
    try {
      await fetch(process.env.N8N_WEBHOOK_URL_NEW_APP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: data.id,
          vacancyId,
          vacancyTitle: vacancyData.title,
          candidateName: `${firstName} ${lastName}`,
          candidateEmail: email,
          aiScore: aiResults.ai_score,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (webhookError) {
      console.error('n8n new app webhook error:', webhookError);
    }
  }

  return { success: true, candidateId: data.id };
}

export async function getResumeUrl(fileName: string) {
  if (!fileName) return null;
  const supabase = await createClient();
  const { data } = supabase.storage.from('cv_uploads').getPublicUrl(fileName);
  return data.publicUrl;
}

export async function cancelApplication(candidateId: string) {
  const supabase = await createClient();
  
  // Verify it belongs to current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'No autorizado' };

  // Note: RLS should enforce the user can only update their own candidate record,
  // but we enforce an email check just in case
  const { data: candidate } = await supabase
    .from('candidates')
    .select('email')
    .eq('id', candidateId)
    .single();
    
  if (!candidate || candidate.email !== user.email) {
    return { success: false, error: 'No autorizado para cancelar esta postulación' };
  }

  const { error } = await supabase
    .from('candidates')
    .update({ status: 'withdrawn' })
    .eq('id', candidateId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/portal');
  revalidatePath('/app/dashboard');
  return { success: true };
}

export async function seedDatabase() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'No user authenticated' };

  // Create a new vacancy
  const { data: vacancy, error: vacancyError } = await supabase
    .from('vacancies')
    .insert({
      title: 'Senior Frontend Engineer',
      description: 'Role for testing real DB connection',
      department: 'Engineering',
      status: 'active',
      created_by: user.id
    })
    .select('id')
    .single();

  if (vacancyError) return { success: false, error: vacancyError.message };

  // Create candidates
  const candidatesToInsert = [
    {
      first_name: 'Carlos',
      last_name: 'Mendoza',
      email: 'carlos.m@example.com',
      status: 'new',
      vacancy_id: vacancy.id,
      ai_score: 98,
      ai_summary: 'Experto en React y Tailwind CSS con 5 años de experiencia liderando equipos ágiles.',
      ai_insights: {
        strengths: ['React.js', 'Arquitectura Frontend', 'Liderazgo técnico'],
        gaps: ['Conocimiento en backend (Node.js) es básico'],
        soft_skills: ['Comunicación asertiva', 'Resolución de problemas complejos']
      }
    },
    {
      first_name: 'Sofia',
      last_name: 'Silva',
      email: 'sofia.s@example.com',
      status: 'screening',
      vacancy_id: vacancy.id,
      ai_score: 95,
      ai_summary: 'Sólida base en UI/UX y creación de Design Systems. Muy enfocada en la accesibilidad web.',
      ai_insights: {
        strengths: ['Accesibilidad (a11y)', 'Figma to Code', 'CSS avanzado'],
        gaps: ['Menos experiencia con Next.js App Router'],
        soft_skills: ['Colaboración interdepartamental', 'Atención al detalle']
      }
    }
  ];

  const { error: candidatesError } = await supabase
    .from('candidates')
    .insert(candidatesToInsert);

  if (candidatesError) return { success: false, error: candidatesError.message };

  return { success: true, vacancyId: vacancy.id };
}
