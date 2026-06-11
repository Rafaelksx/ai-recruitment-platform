'use client';

import { useState } from 'react';
import { updateUserRole } from '@/app/actions/users';
import { Loader2 } from 'lucide-react';

export function RoleSelector({ currentRole }: { currentRole: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(currentRole);

  const roles = [
    { id: 'admin', label: 'Administrador', desc: 'Acceso total a la plataforma.' },
    { id: 'recruiter', label: 'Reclutador', desc: 'Gestiona candidatos y los mueve por el Kanban.' },
    { id: 'hiring_manager', label: 'Hiring Manager', desc: 'Solo puede ver perfiles y dejar notas. (Read-only Kanban)' }
  ];

  const handleRoleChange = async (roleId: string) => {
    if (roleId === currentRole) return;
    
    setIsLoading(true);
    setSelectedRole(roleId);
    
    const result = await updateUserRole(roleId);
    
    setIsLoading(false);
    if (result.success) {
      alert(`Rol actualizado a: ${roleId}. Revisa el Kanban para ver los cambios.`);
    } else {
      alert(`Error: ${result.error}`);
      setSelectedRole(currentRole);
    }
  };

  return (
    <div className="space-y-3 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center backdrop-blur-[1px] rounded-xl">
          <Loader2 className="animate-spin text-accent" />
        </div>
      )}
      
      {roles.map((r) => (
        <div 
          key={r.id}
          onClick={() => handleRoleChange(r.id)}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedRole === r.id 
              ? 'bg-accent/10 border-accent text-accent' 
              : 'bg-muted/30 border-transparent hover:border-border text-foreground/80'
          }`}
        >
          <div className="font-bold flex items-center justify-between">
            {r.label}
            {selectedRole === r.id && <span className="w-2 h-2 rounded-full bg-accent"></span>}
          </div>
          <div className="text-xs opacity-70 mt-1">{r.desc}</div>
        </div>
      ))}
    </div>
  );
}
