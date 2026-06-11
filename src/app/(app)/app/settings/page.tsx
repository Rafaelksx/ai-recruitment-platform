import { getUserProfile } from '@/app/actions/users';
import { Settings, User, Shield, Key } from 'lucide-react';
import { RoleSelector } from './RoleSelector';

export default async function SettingsPage() {
  const profile = await getUserProfile();

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p>No se pudo cargar tu perfil. Intenta iniciar sesión nuevamente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pt-8">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Configuración</h1>
        <p className="text-foreground/60 text-lg font-medium">Gestiona tu perfil y preferencias de la plataforma.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="md:col-span-2 space-y-6">
          <section className="glass-card p-8 rounded-3xl border border-white/20 dark:border-white/5 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-accent" /> Perfil Personal
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-muted-foreground">Nombre Completo</label>
                <div className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 font-medium text-foreground">
                  {profile.full_name || 'Usuario'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-muted-foreground">Correo Electrónico</label>
                <div className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 font-medium text-foreground">
                  {profile.email}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Demo Mode / RBAC Settings */}
        <div className="space-y-6">
          <section className="glass-card p-8 rounded-3xl border border-accent/20 bg-accent/5 shadow-[0_0_30px_rgba(0,210,255,0.05)]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" /> Modo Demo (Roles)
            </h2>
            <p className="text-sm text-foreground/70 mb-6">
              Usa este selector para probar cómo la interfaz cambia dependiendo del nivel de acceso.
            </p>
            
            <RoleSelector currentRole={profile.role} />
          </section>

          <section className="glass-card p-8 rounded-3xl border border-white/20 dark:border-white/5 shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-muted-foreground" /> Seguridad
            </h2>
            <button className="w-full py-3 bg-muted text-foreground font-semibold rounded-xl hover:bg-muted/80 transition-colors">
              Cambiar Contraseña
            </button>
          </section>
        </div>

      </div>
    </div>
  );
}
