import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Briefcase, MapPin, Clock, ArrowRight, Sparkles, Search } from 'lucide-react';

export default async function CareersPage() {
  const supabase = await createClient();

  const { data: vacancies } = await supabase
    .from('vacancies')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--color-cyan-main)]/15 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent font-medium text-sm mb-6 border border-accent/20">
            <Sparkles className="w-4 h-4" />
            Powered by AI
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            Encuentra tu próximo<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-cyan-main)] to-[var(--color-salmon-main)]">
              gran paso
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explora nuestras vacantes abiertas y aplica en minutos. Nuestra IA analizará tu perfil para darte retroalimentación instantánea.
          </p>
        </div>
      </div>

      {/* Vacancy list */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold">Vacantes Abiertas</h2>
            <p className="text-muted-foreground mt-1">
              {vacancies && vacancies.length > 0
                ? `${vacancies.length} oportunidad${vacancies.length !== 1 ? 'es' : ''} disponible${vacancies.length !== 1 ? 's' : ''}`
                : 'No hay vacantes disponibles en este momento'}
            </p>
          </div>
        </div>

        {vacancies && vacancies.length > 0 ? (
          <div className="grid gap-5">
            {vacancies.map((job) => (
              <Link
                key={job.id}
                href={`/careers/${job.id}`}
                className="group glass-card p-7 rounded-2xl border border-white/20 dark:border-white/10 hover:border-[var(--color-cyan-main)]/40 hover:shadow-[0_0_30px_rgba(0,210,255,0.08)] transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-cyan-main)]/20 to-[var(--color-salmon-main)]/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Briefcase size={24} className="text-[var(--color-cyan-main)]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-[var(--color-cyan-main)] transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-muted-foreground font-medium mt-1">{job.department || 'General'}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} /> {job.location || 'Remote (Global)'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} /> {job.employment_type || 'Full-time'}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 font-semibold">
                        Activa
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-foreground/60 group-hover:text-[var(--color-cyan-main)] transition-colors flex-shrink-0">
                  Aplicar <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-border rounded-2xl">
            <Briefcase size={48} className="mx-auto text-muted-foreground mb-6" />
            <h3 className="text-2xl font-bold mb-2">No hay vacantes abiertas</h3>
            <p className="text-muted-foreground">Vuelve pronto, siempre estamos buscando talento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
