'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Candidate, COLUMNS, CandidateStatus } from '@/lib/mock-data';
import { CandidateCard } from './CandidateCard';
import { CandidateDetailSlideOver } from './CandidateDetailSlideOver';
import { updateCandidateStatus } from '@/app/actions/candidates';
import { Lock } from 'lucide-react';

export function KanbanBoard({ initialCandidates, vacancyId, userRole }: { initialCandidates: Candidate[], vacancyId: string, userRole: string }) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const isReadOnly = userRole === 'hiring_manager';

  // Avoid hydration mismatch with Dnd by only rendering on client
  useEffect(() => {
    setCandidates(initialCandidates);
    setIsClient(true);
  }, [initialCandidates]);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newCandidates = Array.from(candidates);
    const candidateIndex = newCandidates.findIndex(c => c.id === draggableId);
    
    if (candidateIndex !== -1) {
      // Optimistic update
      const previousStatus = newCandidates[candidateIndex].status;
      newCandidates[candidateIndex].status = destination.droppableId as CandidateStatus;
      setCandidates(newCandidates);
      
      // Real DB update
      const updateResult = await updateCandidateStatus(draggableId, destination.droppableId, vacancyId);
      if (!updateResult.success) {
        // Rollback on error
        const rollbackCandidates = Array.from(candidates);
        rollbackCandidates[candidateIndex].status = previousStatus;
        setCandidates(rollbackCandidates);
        alert('Hubo un error al guardar el estado: ' + updateResult.error);
      }
    }
  };

  if (!isClient) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-6 overflow-x-auto pb-4 h-full scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex h-full min-w-max gap-6 px-1">
            {COLUMNS.map(column => {
              const columnCandidates = candidates.filter(c => c.status === column.id);
            
            return (
              <div key={column.id} className="flex-shrink-0 w-[350px] flex flex-col glass-card bg-muted/10 border-border/50">
                {/* Column Header */}
                <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/20 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground/80">{column.title}</h3>
                    <span className="bg-background/50 text-foreground/60 text-xs px-2 py-0.5 rounded-full font-semibold border border-border/50">
                      {columnCandidates.length}
                    </span>
                  </div>
                  {isReadOnly && <Lock className="w-4 h-4 text-muted-foreground opacity-50" />}
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={column.id} isDropDisabled={isReadOnly}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 min-h-[150px] rounded-2xl p-3 transition-colors ${
                          snapshot.isDraggingOver 
                            ? 'bg-accent/5 border border-accent/20' 
                            : 'bg-muted/30 border border-transparent'
                        }`}
                      >
                        {columnCandidates.map((candidate, index) => (
                          <Draggable
                            key={candidate.id}
                            draggableId={candidate.id}
                            index={index}
                            isDragDisabled={isReadOnly}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  opacity: snapshot.isDragging ? 0.8 : 1,
                                }}
                              >
                                <CandidateCard 
                                  candidate={candidate} 
                                  isReadOnly={isReadOnly}
                                  onClick={() => setSelectedCandidate(candidate)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      <CandidateDetailSlideOver 
        candidate={selectedCandidate}
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        vacancyId={vacancyId}
        onReject={(rejectedId) => {
          setCandidates(prev => prev.filter(c => c.id !== rejectedId));
          setSelectedCandidate(null);
        }}
      />
    </div>
  );
}
