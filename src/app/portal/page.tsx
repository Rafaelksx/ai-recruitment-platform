import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, Clock, CheckCircle2, XCircle, ArrowRight, FileText, Sparkles } from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  new: { label: 'Enviado', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', icon: <Clock size={14} /> },
  screening: { label: 'En Revisión', color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20', icon: <Clock size={14} /> },
  interview: { label: 'Entrevista', color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20', icon: <CheckCircle2 size={14} /> },
  offer: { label: '¡Oferta!', color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20', icon: <CheckCircle2 size={14} /> },
  rejected: { label: 'No Seleccionado', color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20', icon: <XCircle size={14} /> },
};

export default async function CandidatePortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const firstName = (user.user_metadata?.full_name || user.email || 'Candidato').split(' ')[0];

  // Fetch this candidate's applications (matched by email)
  const { data: applications } = await supabase
    .from('candidates')
    .select(`
      id,
      status,
      ai_score,
      created_at,
      vacancies (
        id,
        title,
        department
      )
    `)
    .eq('email', user.email!)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Hola, {firstName} 👋</h1>
        <p className="text-foreground/60 text-lg">Aquí puedes seguir el estado de todas tus postulaciones.</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Enviadas', value: applications?.length ?? 0, color: 'text-blue-500' },
          { label: 'En Proceso', value: applications?.filter(a => ['screening', 'interview'].includes(a.status)).length ?? 0, color: 'text-cyan-500' },
          { label: 'Ofertas', value: applications?.filter(a => a.status === 'offer').length ?? 0, color: 'text-green-500' },
          { label: 'Score Prom.', value: applications && applications.length > 0 ? Math.round(applications.reduce((sum, a) => sum + (a.ai_score || 0), 0) / applications.length) : '—', color: 'text-[var(--color-salmon-main)]' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-5 rounded-2xl border border-white/20 dark:border-white/10">
            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Applications List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Mis Postulaciones</h2>
          <Link href="/careers" className="text-sm font-semibold text-accent hover:underline flex items-center gap-1">
            Ver más vacantes <ArrowRight size={14} />
          </Link>
        </div>

        {applications && applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => {
              const statusConf = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.new;
              const vacancy = app.vacancies as any;
              return (
                <div
                  key={app.id}
                  className="glass-card p-6 rounded-2xl border border-white/20 dark:border-white/10 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-cyan-main)]/20 to-[var(--color-salmon-main)]/20 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={22} className="text-[var(--color-cyan-main)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">{vacancy?.title ?? 'Vacante eliminada'}</h3>
                    <p className="text-sm text-muted-foreground">{vacancy?.department ?? ''}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Aplicaste el {new Date(app.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {app.ai_score && (
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 bg-cyan-500/5 flex items-center justify-center">
                          <span className="text-sm font-black text-cyan-600 dark:text-[var(--color-cyan-main)]">{app.ai_score}</span>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">Score IA</span>
                      </div>
                    )}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConf.color}`}>
                      {statusConf.icon}
                      {statusConf.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl">
            <FileText size={40} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold mb-2">Aún no tienes postulaciones</h3>
            <p className="text-muted-foreground mb-6">Encuentra vacantes que se adapten a tu perfil y aplica.</p>
            <Link href="/careers" className="inline-flex items-center gap-2 px-5 py-3 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity">
              Explorar vacantes <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {/* AI Tip */}
      <div className="glass-card p-6 rounded-2xl border border-[var(--color-cyan-main)]/20 bg-[var(--color-cyan-main)]/5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-cyan-main)]/20 flex items-center justify-center flex-shrink-0">
          <Sparkles size={20} className="text-[var(--color-cyan-main)]" />
        </div>
        <div>
          <h4 className="font-bold mb-1">¿Cómo maximizar tu Score IA?</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nuestro sistema de IA analiza cómo se alinean tus habilidades con la descripción de cada vacante. Sube un CV actualizado con palabras clave específicas del puesto al que aplicas para obtener un puntaje más alto.
          </p>
        </div>
      </div>
    </div>
  );
}
