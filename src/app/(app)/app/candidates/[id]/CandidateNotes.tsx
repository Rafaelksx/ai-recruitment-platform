'use client';

import { useState } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { saveCandidateNote } from '@/app/actions/candidates';
import { useRouter } from 'next/navigation';

export function CandidateNotes({ candidateId, vacancyId, initialNote }: { candidateId: string, vacancyId: string, initialNote: string | null }) {
  const [note, setNote] = useState(initialNote || '');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  async function handleSave() {
    if (!note.trim() || note === initialNote) return;
    setIsSaving(true);
    const result = await saveCandidateNote(candidateId, note, vacancyId);
    if (result.success) {
      router.refresh();
    } else {
      alert('Error al guardar la nota');
    }
    setIsSaving(false);
  }

  return (
    <section className="glass-card p-6 rounded-2xl border border-white/20 dark:border-white/10 shadow-sm flex flex-col h-full min-h-[300px]">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-foreground/70" /> Notas del Equipo (Human Review)
      </h2>
      
      <div className="flex-1 space-y-4 mb-6 overflow-y-auto">
        {initialNote ? (
          <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-sm">Nota Actual</span>
            </div>
            <p className="text-sm text-foreground/80 whitespace-pre-wrap">{initialNote}</p>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-xl">
            No hay notas guardadas para este candidato.
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-auto">
        <textarea 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Escribe tu evaluación aquí..."
          className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan-main)]/50 resize-none h-20"
        />
        <button 
          onClick={handleSave}
          disabled={isSaving || note === initialNote}
          className="bg-foreground text-background font-semibold px-6 py-2 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center min-w-[120px]"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Guardar Nota'}
        </button>
      </div>
    </section>
  );
}
