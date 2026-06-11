import Link from "next/link";
import { ArrowRight, Bot, Users, BarChart3, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const primaryCtaHref = user ? "/app/dashboard" : "/register";
  const primaryCtaLabel = user ? "Ir al Dashboard" : "Comenzar Gratis";

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative px-6 py-32 md:py-48 overflow-hidden flex flex-col items-center text-center">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-white/40 mb-8 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          New: AI-Powered Candidate Matching 2.0
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight max-w-4xl mb-8 leading-tight">
          Reclutamiento Potenciado, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-red-500 dark:from-cyan-400 dark:to-red-400">
            Decisiones Humanas.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/70 max-w-2xl mb-12 font-medium">
          El primer ATS diseñado como un copiloto inteligente. Deja que la IA analice miles de CVs, mientras tú te enfocas en conectar con el mejor talento.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={primaryCtaHref} className="px-8 py-4 rounded-full bg-foreground text-background font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
            {primaryCtaLabel} <ArrowRight size={20} />
          </Link>
          <Link href="#demo" className="px-8 py-4 rounded-full glass-card font-bold text-lg hover:bg-white/40 dark:hover:bg-white/10 transition-colors flex items-center justify-center">
            Ver Demo Interactiva
          </Link>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">No es 100% IA. Es Human-in-the-Loop.</h2>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto">La IA recomienda, analiza y resume. Tú tienes el control absoluto de cada etapa del proceso.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Bot, title: "Análisis Profundo de CVs", desc: "Extracción automática de skills, experiencia y validación contra los requerimientos de tu vacante en segundos." },
              { icon: Users, title: "Evaluación de Soft Skills", desc: "Detección de patrones de liderazgo y trabajo en equipo para ir más allá de las palabras clave técnicas." },
              { icon: BarChart3, title: "Ranking Explicable", desc: "No solo te damos un 'Score'. Te explicamos exactamente por qué este candidato hace match con tu equipo." },
              { icon: ShieldCheck, title: "Tú Tienes la Última Palabra", desc: "Flujos de aprobación manuales. La IA nunca descartará a un candidato sin tu confirmación final." },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-transparent flex items-center justify-center mb-6 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-foreground/70 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
