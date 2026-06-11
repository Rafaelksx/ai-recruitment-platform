'use client';

import { useState, useTransition } from 'react';
import { User, Mail, Phone, Link as LinkIcon, Globe, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { saveCandidateProfile } from '@/app/actions/portal';

export default function CandidateProfilePage() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setStatus('idle');

    startTransition(async () => {
      const result = await saveCandidateProfile(formData);
      if (result.success) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setErrorMsg(result.error || 'Error desconocido');
      }
    });
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Mi Perfil</h1>
        <p className="text-foreground/60 text-lg">Mantén tu información actualizada para destacar con los reclutadores.</p>
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Personal Info */}
        <section className="glass-card p-8 rounded-2xl border border-white/20 dark:border-white/10 space-y-5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User size={20} className="text-[var(--color-cyan-main)]" />
            Información Personal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Nombre</label>
              <input type="text" name="firstName" className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm" placeholder="Ana" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Apellido</label>
              <input type="text" name="lastName" className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm" placeholder="García" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                <Mail size={12} /> Correo Electrónico
              </label>
              <input type="email" name="email" disabled className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 text-muted-foreground text-sm cursor-not-allowed" placeholder="ana@correo.com" />
              <p className="text-xs text-muted-foreground mt-1">El correo no puede cambiarse.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                <Phone size={12} /> Teléfono
              </label>
              <input type="tel" name="phone" className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm" placeholder="+1 809 000 0000" />
            </div>
          </div>
        </section>

        {/* Professional Info */}
        <section className="glass-card p-8 rounded-2xl border border-white/20 dark:border-white/10 space-y-5">
          <h2 className="text-xl font-bold">Presencia Profesional</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                <LinkIcon size={12} /> LinkedIn
              </label>
              <input type="url" name="linkedin" className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm" placeholder="https://linkedin.com/in/tu-perfil" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
                <Globe size={12} /> Portfolio / Sitio web
              </label>
              <input type="url" name="portfolio" className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm" placeholder="https://tu-portfolio.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Resumen Profesional</label>
              <textarea
                name="summary"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm resize-none"
                placeholder="Cuéntale a los reclutadores quién eres y qué te apasiona..."
              />
            </div>
          </div>
        </section>

        {/* Status Feedback */}
        {status === 'success' && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium">
            <CheckCircle2 size={18} /> ¡Perfil guardado exitosamente!
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isPending ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
