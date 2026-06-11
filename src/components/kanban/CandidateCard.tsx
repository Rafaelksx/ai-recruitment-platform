'use client';

import { Candidate } from '@/lib/mock-data';
import { User, Sparkles, AlertCircle, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CandidateCardProps {
  candidate: Candidate;
  isReadOnly?: boolean;
  onClick: () => void;
}

export function CandidateCard({ candidate, isReadOnly, onClick }: CandidateCardProps) {
  // Color the score based on the value
  const scoreColor = 
    candidate.ai_score >= 90 ? 'text-green-500' : 
    candidate.ai_score >= 70 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative mb-3 rounded-xl p-4 transition-all duration-300',
        'bg-white/40 dark:bg-black/40 backdrop-blur-md border hover:border-accent/50 shadow-sm hover:shadow-md',
        !isReadOnly ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer',
        'border-white/20 dark:border-white/10'
      )}
    >
      {/* Decorative Gradient on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/0 to-primary/0 group-hover:from-accent/5 group-hover:to-primary/5 transition-colors pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent to-primary p-[2px] flex-shrink-0">
            <div className="h-full w-full rounded-full bg-background flex items-center justify-center text-sm font-bold">
              {candidate.first_name[0]}{candidate.last_name[0]}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm leading-tight text-foreground">
              {candidate.first_name} {candidate.last_name}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[140px]">
              {candidate.email}
            </p>
          </div>
        </div>
        
        {/* Grip Icon for dragging affordance */}
        {!isReadOnly && (
          <div className="text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors">
            <GripVertical className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md border border-border/50">
          <Sparkles className={cn("w-3.5 h-3.5", scoreColor)} />
          <span className={cn("text-xs font-bold", scoreColor)}>
            {candidate.ai_score}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider ml-1">
            AI Match
          </span>
        </div>
        
        {candidate.ai_insights?.gaps?.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground" title={`${candidate.ai_insights.gaps.length} areas to review`}>
            <AlertCircle className="w-3.5 h-3.5 text-yellow-500/70" />
            <span>{candidate.ai_insights.gaps.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}
