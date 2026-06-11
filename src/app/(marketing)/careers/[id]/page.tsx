import { Briefcase, MapPin, DollarSign, Clock, UploadCloud, Sparkles, CheckCircle2, User } from 'lucide-react';
import Link from 'next/link';
import { getVacancyDetails } from '@/app/actions/candidates';
import { ApplicationForm } from './ApplicationForm';
import { createClient } from '@/lib/supabase/server';

export default async function CareerJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vacancyId = id;

  // Check if a candidate is logged in
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isCandidate = user?.user_metadata?.role === 'candidate';

  const vacancy = await getVacancyDetails(vacancyId);

  // Check if this logged-in candidate already applied
  let alreadyApplied = false;
  if (isCandidate && user?.email) {
    const { data: existingApp } = await supabase
      .from('candidates')
      .select('id')
      .eq('vacancy_id', vacancyId)
      .eq('email', user.email)
      .single();
    alreadyApplied = !!existingApp;
  }

  if (!vacancy) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center text-foreground">
        <h1 className="text-3xl font-bold mb-4">Vacante no encontrada</h1>
        <p className="text-muted-foreground mb-6">La posición a la que intentas aplicar no existe o ya ha sido cerrada.</p>
        <Link href="/" className="px-6 py-3 bg-foreground text-background font-medium rounded-lg">Volver al inicio</Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent font-medium text-sm mb-6 border border-accent/20">
            <Sparkles className="w-4 h-4" />
            {vacancy.department || 'General'} Team
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            {vacancy.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground font-medium">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-5 h-5" /> {vacancy.location || 'Remote (Global)'}
            </div>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-muted-foreground/30"></div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-5 h-5" /> {vacancy.employment_type || 'Full-time'}
            </div>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-muted-foreground/30"></div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-5 h-5" /> {vacancy.salary_range || 'Competitivo'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Job Description */}
          <div className="lg:col-span-2 space-y-10 text-foreground/80 leading-relaxed text-lg">
            <section className="glass-card p-8 rounded-3xl border border-white/20 dark:border-white/10">
              <h2 className="text-2xl font-bold text-foreground mb-4">Sobre el Rol</h2>
              <p className="mb-4 whitespace-pre-wrap">
                {vacancy.description}
              </p>
            </section>

            {vacancy.responsibilities && vacancy.responsibilities.length > 0 && (
              <section className="glass-card p-8 rounded-3xl border border-white/20 dark:border-white/10">
                <h2 className="text-2xl font-bold text-foreground mb-4">Lo que harás</h2>
                <ul className="space-y-4">
                  {vacancy.responsibilities.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[var(--color-cyan-main)] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Application Form / Candidate Context */}
          <div className="lg:col-span-1 lg:sticky lg:top-32">
            {/* Logged-in candidate banner */}
            {isCandidate && (
              <div className="mb-4 p-4 rounded-2xl border border-[var(--color-cyan-main)]/20 bg-[var(--color-cyan-main)]/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--color-cyan-main)]/20 flex items-center justify-center flex-shrink-0">
                  <User size={18} className="text-[var(--color-cyan-main)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{user?.user_metadata?.full_name || user?.email}</p>
                  <p className="text-xs text-muted-foreground">Postulando como candidato registrado</p>
                </div>
                <Link href="/portal" className="text-xs font-semibold text-[var(--color-cyan-main)] hover:underline flex-shrink-0">
                  Mi portal
                </Link>
              </div>
            )}

            {vacancy.status === 'closed' ? (
              <div className="glass-card rounded-3xl p-8 border border-red-500/20 bg-red-500/5 text-center">
                <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase size={30} />
                </div>
                <h3 className="text-xl font-bold mb-2">Vacante Cerrada</h3>
                <p className="text-muted-foreground text-sm mb-5">
                  El proceso de selección para esta posición ha finalizado y ya no se aceptan nuevas postulaciones.
                </p>
                <Link href="/careers" className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity text-sm">
                  Ver otras vacantes
                </Link>
              </div>
            ) : alreadyApplied ? (
              <div className="glass-card rounded-3xl p-8 border border-green-500/20 bg-green-500/5 text-center">
                <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={30} />
                </div>
                <h3 className="text-xl font-bold mb-2">¡Ya aplicaste!</h3>
                <p className="text-muted-foreground text-sm mb-5">
                  Ya tienes una postulación activa para esta vacante. Haz seguimiento desde tu portal.
                </p>
                <Link href="/portal" className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity text-sm">
                  Ver mis postulaciones
                </Link>
              </div>
            ) : (
              <ApplicationForm vacancyId={vacancy.id} candidateEmail={isCandidate ? user?.email ?? '' : ''} candidateName={isCandidate ? user?.user_metadata?.full_name ?? '' : ''} />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
