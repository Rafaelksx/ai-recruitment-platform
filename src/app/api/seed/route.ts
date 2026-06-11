import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  // Use service role to bypass RLS for seeding
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  try {
    // 1. Get an existing user profile to attach the vacancy to
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .limit(1);

    if (profileError || !profiles || profiles.length === 0) {
      return NextResponse.json({ error: 'No profiles found to assign vacancy' }, { status: 400 });
    }
    const adminUserId = profiles[0].id;

    // 2. Create the Vacancy
    const vacancyId = 'DEV-2026'; // We'll just generate a UUID, but we used DEV-2026 in UI. Supabase expects UUID.
    // Let's create a real UUID and we'll update the UI to use it.
    
    const { data: vacancy, error: vacancyError } = await supabaseAdmin
      .from('vacancies')
      .insert({
        title: 'Senior Frontend Engineer',
        description: 'Buscamos un experto en React y Next.js',
        department: 'Engineering',
        status: 'active',
        created_by: adminUserId
      })
      .select('id')
      .single();

    if (vacancyError) throw vacancyError;

    // 3. Create Candidates
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
      },
      {
        first_name: 'Elena',
        last_name: 'Rojas',
        email: 'elena.r@example.com',
        status: 'interview',
        vacancy_id: vacancy.id,
        ai_score: 92,
        ai_summary: 'Desarrolladora Fullstack con fuerte inclinación al Frontend. Excelente manejo de estado global con Redux y Zustand.',
        ai_insights: {
          strengths: ['TypeScript avanzado', 'Gestión de estado', 'Testing (Jest/Cypress)'],
          gaps: ['Poca experiencia en optimización de rendimiento (Web Vitals)'],
          soft_skills: ['Mentoría a juniors', 'Trabajo bajo presión']
        }
      }
    ];

    const { error: candidatesError } = await supabaseAdmin
      .from('candidates')
      .insert(candidatesToInsert);

    if (candidatesError) throw candidatesError;

    return NextResponse.json({ 
      success: true, 
      message: 'Database seeded successfully', 
      vacancyId: vacancy.id 
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
