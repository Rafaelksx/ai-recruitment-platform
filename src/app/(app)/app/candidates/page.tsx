import { getAllCandidates } from '@/app/actions/candidates';
import { CandidatesClient } from './CandidatesClient';

export default async function CandidatesDirectoryPage() {
  const candidates = await getAllCandidates();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <CandidatesClient initialCandidates={candidates || []} />
    </div>
  );
}
