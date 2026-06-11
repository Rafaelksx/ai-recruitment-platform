'use client';

import { useState } from 'react';
import { updateCandidateStatus, rejectCandidate } from '@/app/actions/candidates';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function CandidateActionButtons({ candidateId, vacancyId, currentStatus }: { candidateId: string, vacancyId: string, currentStatus: string }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  async function handleReject() {
    if (!confirm('¿Seguro que deseas rechazar a este candidato?')) return;
    setIsUpdating(true);
    await rejectCandidate(candidateId, vacancyId);
    router.refresh();
    setIsUpdating(false);
  }

  async function handleMoveToOffer() {
    setIsUpdating(true);
    await updateCandidateStatus(candidateId, vacancyId, 'offer');
    router.refresh();
    setIsUpdating(false);
  }

  if (currentStatus === 'rejected') {
    return (
      <div className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 font-bold text-sm border border-red-500/20">
        Candidato Rechazado
      </div>
    );
  }

  if (currentStatus === 'offer') {
    return (
      <div className="px-4 py-2 rounded-lg bg-green-500/10 text-green-500 font-bold text-sm border border-green-500/20">
        Oferta Extendida
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button 
        onClick={handleReject}
        disabled={isUpdating}
        className="px-4 py-2 rounded-xl bg-muted text-foreground font-semibold hover:bg-red-500/20 hover:text-red-500 transition-colors text-sm disabled:opacity-50 flex items-center justify-center min-w-[90px]"
      >
        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Rechazar'}
      </button>
      <button 
        onClick={handleMoveToOffer}
        disabled={isUpdating}
        className="px-5 py-2 rounded-xl bg-[var(--color-cyan-main)] text-white font-bold hover:opacity-90 shadow-lg shadow-[var(--color-cyan-main)]/20 transition-all text-sm disabled:opacity-50 flex items-center justify-center min-w-[130px]"
      >
        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Mover a Oferta'}
      </button>
    </div>
  );
}
