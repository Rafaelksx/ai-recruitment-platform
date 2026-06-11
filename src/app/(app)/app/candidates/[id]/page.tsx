import { ArrowLeft, Briefcase, Mail, Sparkles, Target, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { getCandidateDetails, getResumeUrl } from '@/app/actions/candidates';
import { CandidateNotes } from './CandidateNotes';
import { CandidateActionButtons } from './CandidateActionButtons';

export default async function CandidateProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const candidateId = id;
  const candidate = await getCandidateDetails(candidateId);

  if (!candidate) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Candidato no encontrado</h2>
        <p className="text-muted-foreground mb-4">Verifica el ID o vuelve al tablero.</p>
        <Link href="/app/dashboard" className="text-accent hover:underline">Volver al Dashboard</Link>
      </div>
    );
  }

  // Fetch public URL for the resume if it exists
  const resumeUrl = candidate.resume_url ? await getResumeUrl(candidate.resume_url) : null;

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div>
          <Link href={`/app/vacancies/${candidate.vacancy_id}/board`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Volver al Kanban
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[var(--color-cyan-main)] to-[var(--color-salmon-main)] flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {candidate.first_name?.[0]}{candidate.last_name?.[0]}
            </div>
            <div>
              <h1 className="text-3xl font-black text-foreground">{candidate.first_name} {candidate.last_name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-1 text-muted-foreground font-medium text-sm">
                <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {candidate.vacancies?.title || 'Sin Rol'}</span>
                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {candidate.email}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto">
          {candidate.ai_score !== null && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-cyan-main)]/10 text-cyan-700 dark:text-[var(--color-cyan-main)] border border-[var(--color-cyan-main)]/20 shadow-sm">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold">IA Match Score: {candidate.ai_score}/100</span>
            </div>
          )}
          <CandidateActionButtons candidateId={candidate.id} vacancyId={candidate.vacancy_id} currentStatus={candidate.status} />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: AI & Notes */}
        <div className="space-y-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 flex flex-col h-full pb-8 lg:pb-0">
          
          {/* AI Assessment */}
          <section className="glass-card p-6 rounded-2xl border border-white/20 dark:border-white/10 shadow-sm relative overflow-hidden flex-shrink-0">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Sparkles className="w-32 h-32 text-[var(--color-cyan-main)]" />
            </div>
            
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--color-cyan-main)]" /> Análisis de IA Gemini
            </h2>
            
            <p className="text-foreground/80 leading-relaxed mb-6 bg-muted/30 p-4 rounded-xl border border-border/50 text-sm font-medium">
              {candidate.ai_summary || "Sin análisis generado."}
            </p>

            {candidate.ai_insights && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-green-600 dark:text-green-400 flex items-center gap-1.5 mb-3">
                    <Target className="w-4 h-4" /> Fortalezas Clave
                  </h3>
                  <ul className="space-y-2">
                    {candidate.ai_insights.strengths?.map((str: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80 leading-tight">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5 mb-3">
                    <AlertTriangle className="w-4 h-4" /> Brechas (Gaps)
                  </h3>
                  <ul className="space-y-2">
                    {candidate.ai_insights.gaps?.map((gap: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80 leading-tight">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Human-in-the-loop Notes (Client Component) */}
          <CandidateNotes candidateId={candidate.id} vacancyId={candidate.vacancy_id} initialNote={candidate.recruiter_notes} />

        </div>

        {/* Right Column: PDF Viewer */}
        <div className="h-[600px] lg:h-full glass-card rounded-2xl border border-white/20 dark:border-white/10 shadow-sm flex flex-col overflow-hidden relative">
          <div className="p-4 border-b border-border/50 bg-muted/20 flex justify-between items-center flex-shrink-0 z-10">
            <h2 className="font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              Currículum Vitae
            </h2>
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[var(--color-cyan-main)] hover:text-[var(--color-salmon-main)] transition-colors">
                Abrir en nueva pestaña
              </a>
            )}
          </div>
          
          <div className="flex-1 bg-white/5 dark:bg-black/20 w-full h-full">
            {resumeUrl ? (
              <iframe 
                src={`${resumeUrl}#toolbar=0`} 
                className="w-full h-full border-none rounded-b-2xl"
                title={`CV de ${candidate.first_name}`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 p-8 text-center">
                <FileText className="w-16 h-16 mb-4" />
                <p className="font-bold text-lg">No hay CV adjunto</p>
                <p className="text-sm mt-1">Este candidato no subió un archivo válido o hubo un error al procesarlo.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
