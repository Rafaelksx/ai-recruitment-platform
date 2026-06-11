import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { signout } from '@/app/auth/actions';
import { Sparkles, LayoutDashboard, FileText, LogOut, User } from 'lucide-react';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const fullName = user.user_metadata?.full_name || user.email || 'Candidato';
  const initials = fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/portal" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-cyan-main)] to-[var(--color-salmon-main)] flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <span className="font-bold text-lg tracking-tight">TalentAI <span className="text-muted-foreground font-normal text-sm">/ Candidato</span></span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <Link href="/portal" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors">
              <LayoutDashboard size={16} /> Mis Postulaciones
            </Link>
            <Link href="/portal/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors">
              <User size={16} /> Mi Perfil
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-cyan-main)] to-[var(--color-salmon-main)] flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <form action={signout}>
              <button type="submit" className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Cerrar sesión">
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
