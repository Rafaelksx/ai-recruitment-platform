'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { signup } from '@/app/auth/actions'
import { Sparkles, ArrowRight, Loader2, AlertCircle, CheckCircle2, User, Briefcase } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [role, setRole] = useState<'recruiter' | 'hiring_manager'>('recruiter')
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)
    formData.set('role', role)

    startTransition(async () => {
      const result = await signup(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="glass p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border-white/40 flex flex-col">
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center gap-2 mb-6 hover:scale-105 transition-transform">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-cyan-main)] to-[var(--color-salmon-main)] flex items-center justify-center text-white shadow-lg">
                <Sparkles size={20} />
              </div>
              <span className="font-bold text-2xl tracking-tight">TalentAI</span>
            </Link>
            <h2 className="text-2xl font-bold text-foreground">Comienza hoy mismo</h2>
            <p className="text-sm text-foreground/60 mt-2 text-center">
              Crea tu cuenta corporativa y optimiza tu proceso de selección
            </p>
          </div>

          {success ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold mb-2">¡Registro completado!</h3>
              <p className="text-foreground/70 mb-8 max-w-sm mx-auto font-medium">
                Hemos enviado un enlace de confirmación a tu correo electrónico. Por favor verifícalo para activar tu cuenta.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Ir al Inicio de Sesión <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-foreground/75 uppercase tracking-wider mb-2" htmlFor="fullName">
                    Nombre Completo
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/20 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-medium text-sm text-foreground"
                    placeholder="Ana María Gómez"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/75 uppercase tracking-wider mb-2" htmlFor="email">
                    Correo Corporativo
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/20 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-medium text-sm text-foreground"
                    placeholder="ana.gomez@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground/75 uppercase tracking-wider mb-2" htmlFor="password">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/20 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-medium text-sm text-foreground"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <span className="block text-xs font-semibold text-foreground/75 uppercase tracking-wider mb-3">
                    Selecciona tu Rol
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setRole('recruiter')}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                        role === 'recruiter'
                          ? 'border-cyan-500 bg-cyan-500/5 ring-1 ring-cyan-500'
                          : 'border-black/10 dark:border-white/10 bg-white/10 dark:bg-black/5 hover:bg-white/25 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        role === 'recruiter' ? 'bg-cyan-500 text-white' : 'bg-black/5 dark:bg-white/5 text-foreground/60'
                      }`}>
                        <Briefcase size={16} />
                      </div>
                      <span className="font-bold text-sm">Reclutador</span>
                      <span className="text-xs text-foreground/50 leading-normal">
                        Maneja vacantes y sube nuevos candidatos.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('hiring_manager')}
                      className={`p-4 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                        role === 'hiring_manager'
                          ? 'border-cyan-500 bg-cyan-500/5 ring-1 ring-cyan-500'
                          : 'border-black/10 dark:border-white/10 bg-white/10 dark:bg-black/5 hover:bg-white/25 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        role === 'hiring_manager' ? 'bg-cyan-500 text-white' : 'bg-black/5 dark:bg-white/5 text-foreground/60'
                      }`}>
                        <User size={16} />
                      </div>
                      <span className="font-bold text-sm">Hiring Manager</span>
                      <span className="text-xs text-foreground/50 leading-normal">
                        Evalúa los mejores perfiles pre-filtrados.
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3.5 px-4 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      Registrarme <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center text-sm border-t border-black/5 dark:border-white/5 pt-6 space-y-2">
                <div>
                  <span className="text-foreground/50">¿Ya tienes una cuenta? </span>
                  <Link href="/login" className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                    Inicia sesión aquí
                  </Link>
                </div>
                <div>
                  <span className="text-foreground/50">¿Eres candidato buscando empleo? </span>
                  <Link href="/register/candidate" className="font-semibold text-foreground/70 hover:underline">
                    Regístrate aquí
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
