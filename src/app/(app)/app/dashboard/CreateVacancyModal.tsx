'use client';

import { useState } from 'react';
import { createVacancy } from '@/app/actions/vacancies';
import { Plus, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CreateVacancyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await createVacancy(formData);
    
    setIsLoading(false);
    
    if (result.success) {
      setIsOpen(false);
      // Optional: Navigate to the new vacancy's board
      // router.push(`/app/vacancies/${result.data.id}/board`);
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-foreground text-background font-bold text-sm rounded-xl hover:bg-foreground/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
      >
        <Plus className="w-4 h-4" /> Nueva Vacante
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-lg rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-2">Crear Nueva Vacante</h2>
              <p className="text-muted-foreground mb-8">Define los detalles del puesto para empezar a recibir candidatos.</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" htmlFor="title">Título del Puesto</label>
                  <input 
                    type="text" 
                    id="title"
                    name="title"
                    required
                    placeholder="Ej. Senior Frontend Developer"
                    className="w-full bg-white/50 dark:bg-black/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2" htmlFor="department">Departamento</label>
                  <input 
                    type="text" 
                    id="department"
                    name="department"
                    required
                    placeholder="Ej. Engineering"
                    className="w-full bg-white/50 dark:bg-black/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2" htmlFor="description">Descripción Corta</label>
                  <textarea 
                    id="description"
                    name="description"
                    required
                    rows={3}
                    placeholder="Resumen del puesto y el objetivo principal..."
                    className="w-full bg-white/50 dark:bg-black/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" htmlFor="location">Ubicación</label>
                    <input 
                      type="text" 
                      id="location"
                      name="location"
                      placeholder="Ej. Remote, Madrid, Híbrido"
                      className="w-full bg-white/50 dark:bg-black/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" htmlFor="employment_type">Modalidad</label>
                    <select 
                      id="employment_type"
                      name="employment_type"
                      className="w-full bg-white/50 dark:bg-black/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract (Freelance)</option>
                      <option value="Internship">Internship (Prácticas)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" htmlFor="salary_range">Salario Estimado</label>
                  <input 
                    type="text" 
                    id="salary_range"
                    name="salary_range"
                    placeholder="Ej. Competitivo, $50k - $80k USD"
                    className="w-full bg-white/50 dark:bg-black/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" htmlFor="responsibilities">Responsabilidades (Una por línea)</label>
                  <textarea 
                    id="responsibilities"
                    name="responsibilities"
                    rows={4}
                    placeholder="Liderar la arquitectura técnica...&#10;Colaborar estrechamente con diseño..."
                    className="w-full bg-white/50 dark:bg-black/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
                  ></textarea>
                </div>
                
                <div className="pt-4 flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 rounded-xl font-bold text-sm bg-muted text-foreground hover:bg-muted/80 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl font-bold text-sm bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_15px_rgba(45,212,191,0.3)]"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Crear Vacante
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
