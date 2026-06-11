'use client';

import { Candidate } from '@/lib/mock-data';
import { X, Sparkles, Target, AlertTriangle, Briefcase, Mail, XCircle, Loader2, StickyNote, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { rejectCandidate, saveCandidateNote } from '@/app/actions/candidates';

interface CandidateDetailSlideOverProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  vacancyId?: string;
  onReject?: (candidateId: string) => void;
}

export function CandidateDetailSlideOver({ candidate, isOpen, onClose, vacancyId, onReject }: CandidateDetailSlideOverProps) {
  const [isPendingReject, startRejectTransition] = useTransition();
  const [isPendingNote, startNoteTransition] = useTransition();
  const [note, setNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  // Sync note with candidate when it changes
  useEffect(() => {
    setNote((candidate as any)?.recruiter_notes || '');
    setNoteSaved(false);
  }, [candidate?.id]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleReject = () => {
    if (!candidate || !vacancyId) return;
    if (!confirm(`¿Estás seguro de que deseas rechazar a ${candidate.first_name} ${candidate.last_name}? Esta acción no se puede deshacer.`)) return;

    startRejectTransition(async () => {
      const result = await rejectCandidate(candidate.id, vacancyId);
      if (result.success) {
        onReject?.(candidate.id);
        onClose();
      } else {
        alert('Error al rechazar: ' + result.error);
      }
    });
  };

  if (!candidate && !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-all duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background border-l shadow-2xl transition-transform duration-500 ease-in-out sm:duration-700",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-full flex-col overflow-y-scroll scrollbar-hide">
          {/* Header */}
          <div className="relative px-6 py-8 sm:px-8 border-b bg-muted/30">
            <button
              type="button"
              className="absolute right-4 top-4 rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              onClick={onClose}
            >
              <span className="sr-only">Close panel</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
            
            {candidate && (
              <div className="mt-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent to-primary p-[2px]">
                    <div className="h-full w-full rounded-full bg-background flex items-center justify-center text-xl font-bold">
                      {candidate.first_name[0]}{candidate.last_name[0]}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {candidate.first_name} {candidate.last_name}
                    </h2>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">{(candidate as any).vacancies?.title || 'Candidato'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{candidate.email}</span>
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-semibold">AI Match Score: {candidate.ai_score || 0}/100</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          {candidate && (
            <div className="relative flex-1 px-6 py-6 sm:px-8 space-y-8">
              
              {/* Summary */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">AI Summary</h3>
                <p className="text-sm leading-relaxed text-foreground/80 bg-muted/50 p-4 rounded-xl border">
                  {candidate.ai_summary || 'Análisis pendiente'}
                </p>
              </div>

              {/* Strengths */}
              {candidate.ai_insights?.strengths && candidate.ai_insights.strengths.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    <Target className="w-4 h-4 text-green-500" />
                    Key Strengths
                  </h3>
                  <ul className="space-y-2">
                    {candidate.ai_insights.strengths.map((strength: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-foreground/80">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Gaps */}
              {candidate.ai_insights?.gaps && candidate.ai_insights.gaps.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    Areas to Probe
                  </h3>
                  <ul className="space-y-2">
                    {candidate.ai_insights.gaps.map((gap: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                        <span className="text-sm text-foreground/80">{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Soft Skills */}
              {candidate.ai_insights?.soft_skills && candidate.ai_insights.soft_skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Soft Skills detected</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.ai_insights.soft_skills.map((skill: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recruiter Notes */}
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  <StickyNote className="w-4 h-4 text-blue-500" />
                  Notas del Reclutador
                </h3>
                <textarea
                  value={note}
                  onChange={(e) => { setNote(e.target.value); setNoteSaved(false); }}
                  rows={4}
                  placeholder="Añade tus observaciones sobre este candidato..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none transition-all"
                />
                <button
                  onClick={() => {
                    if (!candidate || !vacancyId) return;
                    startNoteTransition(async () => {
                      const result = await saveCandidateNote(candidate.id, note, vacancyId);
                      if (result.success) { setNoteSaved(true); setTimeout(() => setNoteSaved(false), 2000); }
                    });
                  }}
                  disabled={isPendingNote}
                  className="mt-2 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                >
                  {isPendingNote ? <Loader2 size={12} className="animate-spin" /> : noteSaved ? <CheckCircle2 size={12} /> : <StickyNote size={12} />}
                  {isPendingNote ? 'Guardando...' : noteSaved ? '¡Guardado!' : 'Guardar nota'}
                </button>
              </div>

            </div>
          )}

          {/* Action Footer */}
          <div className="border-t p-6 bg-muted/10">
            <div className="flex gap-3">
              <Link 
                href={`/app/candidates/${candidate?.id}`}
                className="flex-1 bg-foreground text-background font-medium py-2.5 rounded-lg hover:bg-foreground/90 transition-colors text-center text-sm flex items-center justify-center"
              >
                Ver Perfil Completo
              </Link>
              <button
                onClick={handleReject}
                disabled={isPendingReject || candidate?.status === 'rejected'}
                className="px-5 bg-destructive/10 text-destructive font-medium py-2.5 rounded-lg hover:bg-destructive/20 transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPendingReject ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                {candidate?.status === 'rejected' ? 'Rechazado' : 'Rechazar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

