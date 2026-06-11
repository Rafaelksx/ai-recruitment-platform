import Link from 'next/link';
import { Home, Users, Briefcase, Settings, Sparkles, LogOut, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { signout } from '@/app/auth/actions';

export async function Sidebar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let fullName = 'Ana Reclutadora';
  let roleLabel = 'Lead Recruiter';

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profile) {
      fullName = profile.full_name || user.email || 'Usuario';
      roleLabel = profile.role === 'recruiter' 
        ? 'Reclutador' 
        : profile.role === 'hiring_manager' 
          ? 'Hiring Manager' 
          : 'Administrador';
    } else {
      fullName = user.email || 'Usuario';
      roleLabel = (user.user_metadata?.role === 'hiring_manager' ? 'Hiring Manager' : 'Reclutador');
    }
  }

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-screen sticky top-0 glass border-r border-white/20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-cyan-main)] to-[var(--color-salmon-main)] flex items-center justify-center text-white shadow-lg">
          <Sparkles size={18} />
        </div>
        <span className="font-bold text-xl tracking-tight">TalentAI</span>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {[
          { name: 'Dashboard', icon: Home, href: '/app/dashboard' },
          { name: 'Vacantes', icon: Briefcase, href: '/app/vacancies' },
          { name: 'Candidatos', icon: Users, href: '/app/candidates' },
          { name: 'Matching IA', icon: Zap, href: '/app/matching' },
          { name: 'Configuración', icon: Settings, href: '/app/settings' },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium opacity-80 hover:opacity-100 hover:bg-white/40 dark:hover:bg-black/20 transition-all duration-200"
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-black/5 dark:border-white/10 m-4 rounded-2xl glass-card">
        <div className="flex items-center justify-between gap-3 px-2 py-1">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-800 border border-white/50 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white uppercase">
              {fullName.substring(0, 2)}
            </div>
            <div className="text-sm overflow-hidden">
              <p className="font-semibold truncate">{fullName}</p>
              <p className="text-xs opacity-60 truncate">{roleLabel}</p>
            </div>
          </div>
          <form action={signout}>
            <button 
              type="submit" 
              title="Cerrar Sesión" 
              className="p-1.5 rounded-lg text-foreground/60 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

