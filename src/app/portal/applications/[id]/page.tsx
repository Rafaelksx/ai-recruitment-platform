import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Calendar, CheckCircle2, Clock as ClockIcon, XCircle } from 'lucide-react'
import { CancelApplicationButton } from './CancelApplicationButton'

const STATUS_TIMELINE = [
  { id: 'new', label: 'Postulación Enviada', desc: 'Recibimos tu CV.' },
  { id: 'screening', label: 'En Revisión', desc: 'El equipo está evaluando tu perfil.' },
  { id: 'interview', label: 'Entrevistas', desc: 'Avanzaste a la etapa de entrevistas.' },
  { id: 'offer', label: 'Oferta', desc: '¡Felicidades! Te extendimos una oferta.' },
]

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: app } = await supabase
    .from('candidates')
    .select(`
      id,
      status,
      created_at,
      email,
      vacancies (
        id,
        title,
        department,
        location,
        employment_type,
        salary_range
      )
    `)
    .eq('id', resolvedParams.id)
    .single()

  if (!app || app.email !== user.email) {
    redirect('/portal')
  }

  const vacancy = app.vacancies as any
  const isWithdrawn = app.status === 'withdrawn'
  const isRejected = app.status === 'rejected'

  // Determine current step index
  let currentStepIndex = STATUS_TIMELINE.findIndex(s => s.id === app.status)
  if (currentStepIndex === -1 && !isWithdrawn && !isRejected) currentStepIndex = 0

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link href="/portal" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> Volver al portal
      </Link>

      <div className="glass-card p-8 rounded-3xl border border-white/20 dark:border-white/10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 pb-8 border-b border-border">
          <div className="flex gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-cyan-main)]/20 to-[var(--color-salmon-main)]/20 flex items-center justify-center flex-shrink-0">
              <Briefcase size={28} className="text-[var(--color-cyan-main)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{vacancy?.title ?? 'Vacante Eliminada'}</h1>
              <p className="text-muted-foreground font-medium mt-1">{vacancy?.department}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5"><MapPin size={16} /> {vacancy?.location || 'Remoto'}</span>
                <span className="flex items-center gap-1.5"><Clock size={16} /> {vacancy?.employment_type || 'Full-time'}</span>
                <span className="flex items-center gap-1.5"><Calendar size={16} /> Aplicado el {new Date(app.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            {isWithdrawn ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-muted text-muted-foreground border border-border">
                <XCircle size={16} /> Postulación Retirada
              </span>
            ) : isRejected ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-red-500/10 text-red-600 border border-red-500/20">
                <XCircle size={16} /> No Seleccionado
              </span>
            ) : (
              <CancelApplicationButton candidateId={app.id} />
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-8">Estado del Proceso</h2>
          
          {isWithdrawn || isRejected ? (
            <div className="p-6 rounded-2xl bg-muted/50 border border-border text-center">
              <p className="text-muted-foreground">Este proceso de selección ha finalizado para ti.</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-[19px] w-0.5 bg-border -z-10 md:hidden"></div>
              
              <div className="flex flex-col md:flex-row gap-6 md:gap-4 relative z-0">
                {STATUS_TIMELINE.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  
                  return (
                    <div key={step.id} className="flex-1 relative">
                      {/* Desktop connector line */}
                      {index < STATUS_TIMELINE.length - 1 && (
                        <div className={`hidden md:block absolute top-5 left-1/2 w-full h-0.5 -z-10 ${isCompleted && !isCurrent ? 'bg-[var(--color-cyan-main)]' : 'bg-border'}`}></div>
                      )}
                      
                      <div className="flex items-start md:flex-col md:items-center text-left md:text-center gap-4 md:gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transition-colors ${isCompleted ? 'bg-[var(--color-cyan-main)] text-white' : 'bg-muted text-muted-foreground border-2 border-border'}`}>
                          {isCompleted ? <CheckCircle2 size={20} /> : <ClockIcon size={20} />}
                        </div>
                        <div>
                          <h4 className={`font-bold text-sm ${isCurrent ? 'text-[var(--color-cyan-main)]' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</h4>
                          <p className="text-xs text-muted-foreground mt-1 max-w-[150px] mx-auto hidden md:block">{step.desc}</p>
                          <p className="text-xs text-muted-foreground mt-1 md:hidden">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
