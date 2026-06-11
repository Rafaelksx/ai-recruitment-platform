'use client';

import { useState, useTransition } from 'react';
import { Archive, AlertTriangle, Loader2 } from 'lucide-react';
import { closeVacancy } from '@/app/actions/vacancies';
import { useRouter } from 'next/navigation';

export function CloseVacancyButton({ vacancyId, currentStatus }: { vacancyId: string; currentStatus: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (currentStatus === 'closed') {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 dark:text-[var(--color-salmon-main)] rounded-xl border border-red-500/20 font-bold text-sm">
        <Archive size={16} /> Vacante Cerrada
      </div>
    );
  }

  const handleClose = () => {
    setError(null);
    startTransition(async () => {
      const res = await closeVacancy(vacancyId);
      if (res.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        setError(res.error || 'Error al cerrar la vacante');
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-red-500/10 text-foreground hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-colors font-bold text-sm"
      >
        <Archive size={16} /> Cerrar Vacante
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border p-6 flex flex-col relative">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-xl font-bold text-foreground">¿Cerrar esta Vacante?</h3>
            </div>
            
            <p className="text-muted-foreground text-sm mb-6">
              Al cerrar esta vacante, ya no aceptará nuevos candidatos. Esta acción se puede usar para finalizar el proceso de reclutamiento. ¿Estás seguro de que deseas continuar?
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold">
                {error}
              </div>
            )}

            <div className="flex gap-3 justify-end mt-auto">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="px-4 py-2 rounded-xl text-sm font-bold text-foreground/70 hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleClose}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-lg transition-colors disabled:opacity-50"
              >
                {isPending ? <Loader2 size={16} className="animate-spin" /> : <Archive size={16} />}
                {isPending ? 'Cerrando...' : 'Sí, Cerrar Vacante'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
