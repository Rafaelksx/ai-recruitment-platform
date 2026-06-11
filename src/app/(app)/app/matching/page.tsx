import { createClient } from '@/lib/supabase/server';
import { MatchingClient } from './MatchingClient';

export default async function MatchingPage() {
  const supabase = await createClient();

  // Fetch all candidates with their vacancy info, sorted by ai_score desc
  const { data: allCandidates } = await supabase
    .from('candidates')
    .select(`
      id,
      first_name,
      last_name,
      email,
      ai_score,
      ai_summary,
      ai_insights,
      status,
      vacancy_id,
      vacancies (
        id,
        title,
        department
      )
    `)
    .not('ai_score', 'is', null)
    .neq('status', 'rejected')
    .order('ai_score', { ascending: false });

  // Fetch active vacancies for the per-vacancy breakdown
  const { data: vacancies } = await supabase
    .from('vacancies')
    .select('id, title, department')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <MatchingClient initialCandidates={(allCandidates as any) || []} vacancies={vacancies || []} />
    </div>
  );
}
