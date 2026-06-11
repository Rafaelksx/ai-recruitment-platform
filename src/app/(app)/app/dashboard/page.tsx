import { Users, FileText, CalendarCheck, TrendingUp, Sparkles, ArrowRight, Database } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/app/actions/users";
import { CreateVacancyModal } from "./CreateVacancyModal";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Use the new getUserProfile action to get the user's role and full name
  const profile = await getUserProfile();

  let firstName = 'Usuario';
  if (user) {
    const fullName = profile?.full_name || user.user_metadata?.full_name || user.email || 'Usuario';
    firstName = fullName.split(' ')[0];
  }

  // Fetch real active vacancies (limit 3)
  const { data: vacancies } = await supabase
    .from('vacancies')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch top 4 candidates globally by ai_score
  const { data: topCandidates } = await supabase
    .from('candidates')
    .select(`
      *,
      vacancies (
        title
      )
    `)
    .order('ai_score', { ascending: false, nullsFirst: false })
    .limit(4);

  // Fetch real metrics
  const { count: totalCandidates } = await supabase
    .from('candidates')
    .select('id', { count: 'exact', head: true });

  const { count: aiProcessed } = await supabase
    .from('candidates')
    .select('id', { count: 'exact', head: true })
    .not('ai_score', 'is', null);

  const { count: activeInterviews } = await supabase
    .from('candidates')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'interview');

  const { count: hiredCandidates } = await supabase
    .from('candidates')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'offered');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Hola, {firstName} 👋</h1>
          <p className="text-foreground/60 text-lg font-medium">Aquí tienes un resumen de tu reclutamiento hoy.</p>
        </div>
        <div className="flex gap-3">
          <CreateVacancyModal />
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Total Candidatos", value: totalCandidates || 0, trend: "+0%", icon: Users, color: "text-blue-600 dark:text-blue-400" },
          { label: "Procesados por IA", value: aiProcessed || 0, trend: "+0%", icon: FileText, color: "text-cyan-600 dark:text-[var(--color-cyan-main)]" },
          { label: "Entrevistas Activas", value: activeInterviews || 0, trend: "0%", icon: CalendarCheck, color: "text-purple-600 dark:text-purple-400" },
          { label: "Contratados/Ofertas", value: hiredCandidates || 0, trend: "+0%", icon: TrendingUp, color: "text-red-500 dark:text-[var(--color-salmon-main)]" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-current opacity-5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl bg-white/60 dark:bg-black/30 shadow-sm border border-white/40 dark:border-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-sm font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-[var(--color-salmon-main)]'}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
              <p className="text-foreground/70 font-semibold text-sm mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <section className="xl:col-span-2 glass-card p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Vacantes Activas (Recientes)</h2>
            <Link href="/app/vacancies" className="text-sm font-semibold text-foreground/60 hover:text-foreground flex items-center gap-1 transition-colors">
              Ver todas <ArrowRight size={16} />
            </Link>
          </div>
          <div className="space-y-4 flex-1">
            {vacancies && vacancies.length > 0 ? (
              vacancies.map((job) => (
                <Link href={`/app/vacancies/${job.id}/board`} key={job.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white/20 dark:bg-black/10 hover:bg-white/50 dark:hover:bg-white/5 transition-all border border-white/30 dark:border-white/5 cursor-pointer">
                  <div className="mb-4 sm:mb-0">
                    <h4 className="font-bold text-lg group-hover:text-cyan-600 dark:group-hover:text-[var(--color-cyan-main)] transition-colors">{job.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-foreground/60">{job.department || 'General'}</span>
                      <span className="w-1 h-1 rounded-full bg-foreground/30"></span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-foreground/5 text-foreground/70">{job.status === 'active' ? 'Abierta' : 'Cerrada'}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full">
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-lg group-hover:scale-110 transition-transform origin-right">Ver Tablero</p>
                      <p className="text-xs font-medium text-foreground/50 uppercase tracking-wider">Candidatos</p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                      job.status === 'active' ? 'bg-cyan-500/10 text-cyan-700 dark:text-[var(--color-cyan-main)] border border-cyan-500/20' : 
                      'bg-red-500/10 text-red-600 dark:text-[var(--color-salmon-main)] border border-red-500/20'
                    }`}>
                      {job.status.toUpperCase()}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center p-8 text-muted-foreground border border-dashed border-border rounded-xl">
                No hay vacantes aún. Usa el botón <span className="font-semibold text-foreground">"Nueva Vacante"</span> para comenzar.
              </div>
            )}
          </div>
        </section>

        <section className="glass-card p-8 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 dark:bg-[var(--color-cyan-main)]/10 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 dark:bg-[var(--color-salmon-main)]/10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <Sparkles className="text-cyan-600 dark:text-[var(--color-cyan-main)]" size={24} />
            <h2 className="text-2xl font-bold">Top Recomendados</h2>
          </div>
          
          <div className="space-y-5 relative z-10 flex-1">
            {topCandidates && topCandidates.length > 0 ? (
              topCandidates.map((candidate) => (
                <Link href={`/app/candidates/${candidate.id}`} key={candidate.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/40 dark:hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-cyan-main)] to-[var(--color-salmon-main)] shadow-sm flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {candidate.first_name[0]}{candidate.last_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold truncate">{candidate.first_name} {candidate.last_name}</h4>
                    <p className="text-xs font-semibold text-cyan-700 dark:text-[var(--color-cyan-main)] truncate mb-0.5">{candidate.vacancies?.title || 'Sin Asignar'}</p>
                    <p className="text-xs text-foreground/50 truncate">
                      {candidate.ai_insights?.strengths?.[0] || 'Nuevo Perfil'}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-full border-2 border-cyan-500/30 bg-cyan-500/5 text-cyan-700 dark:text-[var(--color-cyan-main)] font-black text-sm group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,210,255,0.1)]">
                    {candidate.ai_score || 0}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center p-8 text-muted-foreground border border-dashed border-border rounded-xl">
                No hay candidatos evaluados.
              </div>
            )}
          </div>
          
          <Link href="/app/candidates" className="block text-center w-full mt-6 py-3 rounded-xl font-bold text-sm bg-foreground/5 hover:bg-foreground/10 text-foreground transition-colors relative z-10">
            Ver Ranking Completo
          </Link>
        </section>
      </div>
    </div>
  );
}
