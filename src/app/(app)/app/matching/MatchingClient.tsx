'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, Briefcase, ArrowRight, Star, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';

type Candidate = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  ai_score: number | null;
  ai_summary: string | null;
  ai_insights: any;
  status: string;
  vacancy_id: string;
  vacancies: {
    id: string;
    title: string;
    department: string | null;
  } | null;
};

type Vacancy = {
  id: string;
  title: string;
  department: string | null;
};

export function MatchingClient({ initialCandidates, vacancies }: { initialCandidates: Candidate[], vacancies: Vacancy[] }) {
  const [selectedVacancyId, setSelectedVacancyId] = useState<string>('all');

  function getScoreColor(score: number) {
    if (score >= 85) return 'text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20';
    if (score >= 65) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20';
  }

  const filteredCandidates = selectedVacancyId === 'all'
    ? initialCandidates.slice(0, 10) // Top 10 global
    : initialCandidates.filter(c => c.vacancy_id === selectedVacancyId);

  const selectedVacancyName = selectedVacancyId === 'all' 
    ? 'Top 10 Global' 
    : vacancies.find(v => v.id === selectedVacancyId)?.title;

  return (
    <div className="space-y-10">
      {/* Header and Filter */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-[var(--color-cyan-main)]/10 border border-[var(--color-cyan-main)]/20">
              <Sparkles size={22} className="text-[var(--color-cyan-main)]" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">Matching IA</h1>
          </div>
          <p className="text-foreground/60 text-lg">
            Compara candidatos rankeados por inteligencia artificial y revisa sus fortalezas.
          </p>
        </div>

        <div className="w-full md:w-72">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Filtrar por Vacante</label>
          <div className="relative">
            <select
              value={selectedVacancyId}
              onChange={(e) => setSelectedVacancyId(e.target.value)}
              className="w-full appearance-none bg-white/50 dark:bg-black/20 border border-border rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan-main)]/50 transition-all cursor-pointer"
            >
              <option value="all">🌐 Top 10 Global (Todas las vacantes)</option>
              {vacancies.map(v => (
                <option key={v.id} value={v.id}>💼 {v.title}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none w-5 h-5" />
          </div>
        </div>
      </header>

      {/* Main List */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp size={20} className="text-[var(--color-salmon-main)]" />
          <h2 className="text-2xl font-bold">Resultados: {selectedVacancyName}</h2>
        </div>
        
        {filteredCandidates.length > 0 ? (
          <div className="grid gap-4">
            {filteredCandidates.map((candidate, idx) => {
              const vacancy = candidate.vacancies;
              const insights = candidate.ai_insights;
              const strengths = insights?.strengths || [];
              const gaps = insights?.gaps || [];

              return (
                <div key={candidate.id} className="glass-card p-6 rounded-2xl border border-white/20 dark:border-white/10 flex flex-col md:flex-row gap-6 hover:border-[var(--color-cyan-main)]/30 transition-all">
                  
                  {/* Left Side: Basic Info & Score */}
                  <div className="flex items-start gap-4 md:w-1/3 flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 mt-1 ${idx === 0 ? 'bg-yellow-400 text-yellow-900 shadow-[0_0_15px_rgba(250,204,21,0.4)]' : idx === 1 ? 'bg-slate-300 text-slate-700' : idx === 2 ? 'bg-orange-400 text-orange-900' : 'bg-muted text-muted-foreground'}`}>
                      {idx === 0 ? <Star size={18} fill="currentColor" /> : `#${idx + 1}`}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg leading-tight">{candidate.first_name} {candidate.last_name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{candidate.email}</p>
                      
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 ${getScoreColor(candidate.ai_score || 0)}`}>
                        <Sparkles size={16} />
                        <span className="font-black text-lg">{candidate.ai_score}</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">IA Match</span>
                      </div>
                      
                      {selectedVacancyId === 'all' && vacancy && (
                        <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1 font-medium bg-muted/50 p-2 rounded-lg inline-flex">
                          <Briefcase size={12} /> {vacancy.title}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Insights */}
                  <div className="flex-1 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                    <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                      "{candidate.ai_summary || 'Análisis resumido no disponible.'}"
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-4 mt-auto">
                      {/* Strengths */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400 flex items-center gap-1">
                          <CheckCircle2 size={14} /> Fortalezas Clave
                        </h4>
                        <ul className="space-y-1">
                          {strengths.slice(0, 3).map((s: string, i: number) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5 leading-tight">
                              <span className="text-green-500 mt-0.5">•</span> {s}
                            </li>
                          ))}
                          {strengths.length === 0 && <li className="text-xs text-muted-foreground italic">No detectadas</li>}
                        </ul>
                      </div>

                      {/* Gaps */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1">
                          <AlertCircle size={14} /> Áreas a Indagar
                        </h4>
                        <ul className="space-y-1">
                          {gaps.slice(0, 3).map((g: string, i: number) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5 leading-tight">
                              <span className="text-orange-500 mt-0.5">•</span> {g}
                            </li>
                          ))}
                          {gaps.length === 0 && <li className="text-xs text-muted-foreground italic">Ninguna importante</li>}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Link 
                        href={`/app/candidates/${candidate.id}`}
                        className="text-xs font-bold text-[var(--color-cyan-main)] hover:text-[var(--color-salmon-main)] transition-colors flex items-center gap-1"
                      >
                        Ver Perfil Completo <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-3xl text-muted-foreground glass-card">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={24} className="opacity-40" />
            </div>
            <h3 className="text-xl font-bold mb-2">No hay candidatos procesados</h3>
            <p className="text-sm max-w-md mx-auto">
              Aún no hay candidatos con evaluación de IA para esta vacante.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
