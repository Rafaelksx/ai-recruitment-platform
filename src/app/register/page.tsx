import Link from 'next/link';
import { Sparkles, User, Building2, ArrowRight } from 'lucide-react';

export default function RegisterSelectionPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative p-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-cyan-main)]/15 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-salmon-main)]/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col items-center mb-12 text-center">
          <Link href="/" className="flex items-center gap-2 mb-6 hover:scale-105 transition-transform">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-cyan-main)] to-[var(--color-salmon-main)] flex items-center justify-center text-white shadow-lg">
              <Sparkles size={20} />
            </div>
            <span className="font-bold text-2xl tracking-tight">TalentAI</span>
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">¿Cómo deseas unirte?</h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            Selecciona el tipo de cuenta que deseas crear para continuar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Candidate Card */}
          <Link 
            href="/register/candidate"
            className="group glass p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border border-white/20 dark:border-white/10 hover:border-[var(--color-cyan-main)]/50 hover:bg-white/40 dark:hover:bg-white/5 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-cyan-main)]/0 to-[var(--color-cyan-main)]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-cyan-main)]/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <User size={32} className="text-[var(--color-cyan-main)]" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Soy Candidato</h2>
            <p className="text-muted-foreground mb-8">
              Estoy buscando empleo. Quiero crear mi perfil, aplicar a vacantes y recibir feedback de la IA.
            </p>
            <div className="mt-auto flex items-center gap-2 font-bold text-[var(--color-cyan-main)] group-hover:gap-4 transition-all">
              Crear cuenta de candidato <ArrowRight size={18} />
            </div>
          </Link>

          {/* Corporate Card */}
          <Link 
            href="/register/corporate"
            className="group glass p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border border-white/20 dark:border-white/10 hover:border-[var(--color-salmon-main)]/50 hover:bg-white/40 dark:hover:bg-white/5 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-salmon-main)]/0 to-[var(--color-salmon-main)]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-salmon-main)]/20 to-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Building2 size={32} className="text-[var(--color-salmon-main)]" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Soy Empresa</h2>
            <p className="text-muted-foreground mb-8">
              Quiero reclutar talento. Crear vacantes, gestionar candidatos y usar IA para filtrar perfiles.
            </p>
            <div className="mt-auto flex items-center gap-2 font-bold text-[var(--color-salmon-main)] group-hover:gap-4 transition-all">
              Crear cuenta corporativa <ArrowRight size={18} />
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center text-sm">
          <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
          <Link href="/login" className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
