'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Sparkles, UserCircle } from 'lucide-react';

export function CandidatesClient({ initialCandidates }: { initialCandidates: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCandidates = initialCandidates.filter((candidate) => {
    if (!searchQuery.trim()) return true;
    
    const q = searchQuery.toLowerCase();
    const fullName = `${candidate.first_name} ${candidate.last_name}`.toLowerCase();
    const email = candidate.email?.toLowerCase() || '';
    const vacancyTitle = candidate.vacancies?.title?.toLowerCase() || '';

    return fullName.includes(q) || email.includes(q) || vacancyTitle.includes(q);
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Directorio de Candidatos</h1>
          <p className="text-foreground/60 text-lg font-medium">Gestiona y busca en toda tu base de talento.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, email o vacante..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/50 dark:bg-black/20 border border-border focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan-main)]/50 transition-all text-sm font-medium"
            />
          </div>
          <button className="p-2 rounded-xl border border-border bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 transition-colors">
            <Filter className="w-5 h-5 text-foreground/70" />
          </button>
        </div>
      </header>

      <div className="glass-card rounded-2xl overflow-hidden border border-white/20 dark:border-white/5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border/50 text-muted-foreground text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Candidato</th>
                <th className="p-4 font-semibold">Vacante</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold text-center">AI Score</th>
                <th className="p-4 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredCandidates && filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate: any) => (
                  <tr key={candidate.id} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-cyan-main)] to-[var(--color-salmon-main)] flex flex-shrink-0 items-center justify-center text-white font-bold text-sm shadow-sm">
                          {candidate.first_name?.[0]}{candidate.last_name?.[0]}
                        </div>
                        <div>
                          <div className="font-bold text-foreground group-hover:text-[var(--color-cyan-main)] transition-colors">
                            {candidate.first_name} {candidate.last_name}
                          </div>
                          <div className="text-xs text-muted-foreground">{candidate.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-foreground/80">
                      {candidate.vacancies?.title || 'Sin Asignar'}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-muted text-muted-foreground border border-border/50 uppercase tracking-wider">
                        {candidate.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {candidate.ai_score ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-cyan-main)]/10 text-cyan-700 dark:text-[var(--color-cyan-main)] font-bold text-xs border border-[var(--color-cyan-main)]/20 shadow-sm">
                          <Sparkles className="w-3 h-3" /> {candidate.ai_score}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        href={`/app/candidates/${candidate.id}`}
                        className="inline-flex px-4 py-2 bg-foreground text-background text-xs font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md"
                      >
                        Ver Perfil
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-muted-foreground border-dashed">
                    <UserCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium text-foreground/80 mb-1">No se encontraron candidatos</p>
                    <p className="text-sm">Prueba ajustando los términos de búsqueda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
