'use client';

import { useState } from 'react';
import { applyToVacancy } from '@/app/actions/candidates';
import { UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';

export function ApplicationForm({ vacancyId, candidateEmail = '', candidateName = '' }: { vacancyId: string; candidateEmail?: string; candidateName?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileName, setFileName] = useState('');

  const [firstName, setFirstName] = useState(candidateName.split(' ')[0] || '');
  const [lastName, setLastName] = useState(candidateName.split(' ').slice(1).join(' ') || '');
  const isLoggedIn = !!candidateEmail;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.append('vacancyId', vacancyId);

    const result = await applyToVacancy(formData);

    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
    } else {
      alert(`Hubo un error al enviar tu postulación: ${result.error}`);
    }
  };

  if (isSuccess) {
    return (
      <div className="glass-card rounded-3xl p-8 border border-white/20 dark:border-white/10 text-center animate-in zoom-in duration-500">
        <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-foreground">¡Postulación Recibida!</h3>
        <p className="text-muted-foreground mb-4">
          Nuestra IA está analizando tu CV. Te contactaremos pronto.
        </p>
        {/* CTA to create account — only show if not already logged in */}
        {!isLoggedIn && (
          <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 mb-6 text-left">
            <p className="text-sm font-semibold text-accent mb-1">💡 ¿Quieres dar seguimiento?</p>
            <p className="text-xs text-muted-foreground">
              Crea tu cuenta gratuita de candidato y podrás ver el estado de todas tus postulaciones en tiempo real.
            </p>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {!isLoggedIn && (
            <a
              href="/register/candidate"
              className="w-full py-3 px-4 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Crear mi cuenta de candidato
            </a>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-muted text-foreground text-sm font-semibold rounded-xl hover:bg-muted/80 transition-colors"
          >
            Enviar otra postulación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-8 border border-white/20 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.02)]">
      <h3 className="text-2xl font-bold mb-6 text-foreground">Aplica ahora</h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="firstName">Nombre</label>
            <input 
              type="text" 
              id="firstName"
              name="firstName"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ana"
              className="w-full bg-white/50 dark:bg-black/50 border border-white/30 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="lastName">Apellido</label>
            <input 
              type="text" 
              id="lastName"
              name="lastName"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="García"
              className="w-full bg-white/50 dark:bg-black/50 border border-white/30 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-2" htmlFor="email">Correo Electrónico</label>
          <input 
            type="email" 
            id="email"
            name="email"
            required
            defaultValue={candidateEmail}
            readOnly={isLoggedIn}
            placeholder="ana@ejemplo.com"
            className={`w-full bg-white/50 dark:bg-black/50 border border-white/30 dark:border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all ${isLoggedIn ? 'opacity-70 cursor-not-allowed' : ''}`}
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-2">Curriculum Vitae (PDF)</label>
          <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer group ${fileName ? 'border-accent bg-accent/5' : 'border-muted-foreground/30 hover:bg-white/40 dark:hover:bg-white/5'}`}>
            <input 
              type="file" 
              name="cv" 
              accept=".pdf"
              required
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFileName(e.target.files[0].name);
                } else {
                  setFileName('');
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {fileName ? (
              <div className="flex flex-col items-center justify-center">
                <CheckCircle2 className="w-10 h-10 mx-auto text-accent mb-3" />
                <p className="text-sm font-medium text-accent truncate max-w-xs">{fileName}</p>
                <p className="text-xs text-muted-foreground mt-1">Haz clic o arrastra para cambiar</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <UploadCloud className="w-10 h-10 mx-auto text-muted-foreground group-hover:text-accent transition-colors mb-3" />
                <p className="text-sm font-medium">Arrastra tu CV aquí o <span className="text-accent">haz clic</span></p>
                <p className="text-xs text-muted-foreground mt-1">Solo formato PDF (Max. 5MB)</p>
              </div>
            )}
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl font-bold text-background bg-foreground hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Postulación'}
        </button>
        <p className="text-xs text-center text-muted-foreground mt-4">
          Al enviar, nuestra IA hará un análisis inicial rápido de tu perfil para agilizar el proceso.
        </p>
      </form>
    </div>
  );
}
