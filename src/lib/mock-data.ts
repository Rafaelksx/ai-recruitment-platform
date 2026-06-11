export type CandidateStatus = 'new' | 'screening' | 'interview' | 'offered' | 'rejected';

export interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: CandidateStatus;
  role: string;
  ai_score: number;
  ai_summary: string;
  ai_insights: {
    strengths: string[];
    gaps: string[];
    soft_skills: string[];
  };
  avatar_url?: string;
}

export const COLUMNS = [
  { id: 'new', title: 'Nuevos' },
  { id: 'screening', title: 'Análisis IA' },
  { id: 'interview', title: 'Entrevistas' },
  { id: 'offered', title: 'Oferta' },
  { id: 'rejected', title: 'Descartados' }
] as const;
