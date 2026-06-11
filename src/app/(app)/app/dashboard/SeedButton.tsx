'use client';

import { useState } from 'react';
import { Database, Loader2 } from 'lucide-react';
import { seedDatabase } from '@/app/actions/candidates';
import { useRouter } from 'next/navigation';

export function SeedButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSeed = async () => {
    setIsLoading(true);
    const result = await seedDatabase();
    
    if (result.success) {
      alert('Datos sembrados exitosamente!');
      router.push(`/app/vacancies/${result.vacancyId}/board`);
    } else {
      alert('Error sembrando datos: ' + result.error);
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSeed}
      disabled={isLoading}
      className="glass-card px-6 py-3 flex items-center gap-2 font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20 transition-all disabled:opacity-50"
    >
      {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Database size={18} />}
      <span>Sembrar Datos de Prueba (Supabase)</span>
    </button>
  );
}
