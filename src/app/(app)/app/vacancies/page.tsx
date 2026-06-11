import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { VacanciesClient } from "./VacanciesClient";

export default async function VacanciesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch all vacancies
  const { data: vacancies } = await supabase
    .from('vacancies')
    .select(`
      *,
      candidates:candidates(count)
    `)
    .order('created_at', { ascending: false });

  // Map the data to a more manageable shape
  const formattedVacancies = (vacancies || []).map(v => ({
    ...v,
    candidatesCount: v.candidates?.[0]?.count || 0
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Vacantes</h1>
        <p className="text-foreground/60 text-lg font-medium">
          Gestiona todos los procesos de selección y filtra por estado o departamento.
        </p>
      </header>

      <VacanciesClient initialVacancies={formattedVacancies} />
    </div>
  );
}
