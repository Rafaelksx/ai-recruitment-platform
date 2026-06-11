import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { ArrowLeft, ExternalLink, Users } from 'lucide-react';
import Link from 'next/link';
import { getVacancyDetails, getCandidatesByVacancy } from '@/app/actions/candidates';
import { getUserProfile } from '@/app/actions/users';
import { CloseVacancyButton } from './CloseVacancyButton';

export default async function VacancyBoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vacancyId = id;
  
  // Fetch from Supabase
  const vacancy = await getVacancyDetails(vacancyId);
  const candidates = await getCandidatesByVacancy(vacancyId);
  const profile = await getUserProfile();
  
  if (!vacancy) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Vacante no encontrada</h2>
        <p className="text-muted-foreground mb-4">Asegúrate de haber sembrado la base de datos o verifica el ID.</p>
        <Link href="/app/dashboard" className="text-accent hover:underline">Volver al Dashboard</Link>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Link href="/app/dashboard" className="hover:text-foreground transition-colors flex items-center gap-1 text-sm">
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {vacancy.title} <span className="text-muted-foreground font-normal">#{vacancy.id.split('-')[0]}</span>
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md">
              <span className={`w-2 h-2 rounded-full ${vacancy.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {vacancy.status === 'active' ? 'Activa' : 'Cerrada'}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {candidates.length} Candidatos
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CloseVacancyButton vacancyId={vacancy.id} currentStatus={vacancy.status} />
          
          <Link href={`/careers/${vacancy.id}`} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted border border-border text-foreground rounded-xl transition-colors text-sm font-bold">
            <ExternalLink className="w-4 h-4" />
            Portal Público
          </Link>
          <button className="px-4 py-2 bg-foreground hover:opacity-90 text-background rounded-xl transition-all text-sm font-bold shadow-md">
            Invitar Candidato
          </button>
        </div>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 min-h-0">
        <KanbanBoard initialCandidates={candidates as any} vacancyId={vacancy.id} userRole={profile?.role || 'recruiter'} />
      </div>
    </div>
  );
}
