'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Filter, Briefcase } from 'lucide-react';

type Vacancy = {
  id: string;
  title: string;
  department: string | null;
  status: string;
  created_at: string;
  candidatesCount: number;
};

export function VacanciesClient({ initialVacancies }: { initialVacancies: Vacancy[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all');

  // Filter logic
  const filteredVacancies = initialVacancies.filter((vacancy) => {
    // 1. Filter by status
    if (statusFilter !== 'all' && vacancy.status !== statusFilter) {
      return false;
    }
    // 2. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = vacancy.title.toLowerCase().includes(q);
      const matchesDept = vacancy.department?.toLowerCase().includes(q);
      if (!matchesTitle && !matchesDept) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between border border-white/20 dark:border-white/10">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por título o departamento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan-main)]/50 transition-all text-sm font-medium"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <Filter size={16} className="text-muted-foreground hidden md:block" />
          {(['all', 'active', 'closed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                statusFilter === status
                  ? 'bg-foreground text-background shadow-md'
                  : 'bg-muted/50 text-foreground/70 hover:bg-muted'
              }`}
            >
              {status === 'all' ? 'Todas' : status === 'active' ? 'Activas' : 'Cerradas'}
            </button>
          ))}
        </div>
      </div>

      {/* Vacancies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVacancies.length > 0 ? (
          filteredVacancies.map((job) => (
            <Link 
              href={`/app/vacancies/${job.id}/board`} 
              key={job.id} 
              className="group glass-card p-6 flex flex-col justify-between rounded-2xl hover:bg-white/40 dark:hover:bg-white/5 transition-all border border-white/30 dark:border-white/5 cursor-pointer h-full"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-[var(--color-cyan-main)]/10 to-[var(--color-salmon-main)]/10 border border-[var(--color-cyan-main)]/20 text-[var(--color-cyan-main)]">
                    <Briefcase size={20} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    job.status === 'active' 
                      ? 'bg-cyan-500/10 text-cyan-700 dark:text-[var(--color-cyan-main)] border border-cyan-500/20' 
                      : 'bg-red-500/10 text-red-600 dark:text-[var(--color-salmon-main)] border border-red-500/20'
                  }`}>
                    {job.status === 'active' ? 'ACTIVA' : 'CERRADA'}
                  </span>
                </div>
                <h4 className="font-bold text-xl group-hover:text-[var(--color-cyan-main)] transition-colors line-clamp-2">
                  {job.title}
                </h4>
                <p className="text-sm font-medium text-foreground/60 mt-1 flex items-center gap-2">
                  {job.department || 'General'}
                  <span>•</span>
                  <span>{new Date(job.created_at).toLocaleDateString()}</span>
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-black text-lg">{job.candidatesCount}</span>
                  <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">Candidatos</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-12 glass-card rounded-2xl text-center border border-dashed border-border">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
              <Search size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">No se encontraron vacantes</h3>
            <p className="text-muted-foreground max-w-sm">
              Prueba cambiando los filtros o el texto de búsqueda para encontrar lo que necesitas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
