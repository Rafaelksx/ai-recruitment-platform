'use client'

import { useState, useTransition } from 'react'
import { updatePassword } from '@/app/auth/actions'
import { Sparkles, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function UpdatePasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)

    const password = formData.get('password') as string
    const confirm = formData.get('confirm') as string

    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }

    startTransition(async () => {
      const result = await updatePassword(formData)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass p-8 md:p-10 rounded-3xl shadow-2xl border-white/40 flex flex-col">
          <div className="flex flex-col items-center mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-cyan-main)] to-[var(--color-salmon-main)] flex items-center justify-center text-white shadow-lg mb-6">
              <Sparkles size={20} />
            </div>
            <h2 className="text-2xl font-bold text-foreground text-center">Actualiza tu contraseña</h2>
            <p className="text-sm text-foreground/60 mt-2 text-center">
              Ingresa tu nueva contraseña para volver a acceder.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-foreground/75 uppercase tracking-wider mb-2" htmlFor="password">
                Nueva Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/20 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-medium text-sm text-foreground"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/75 uppercase tracking-wider mb-2" htmlFor="confirm">
                Confirmar Contraseña
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/20 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-medium text-sm text-foreground"
                placeholder="Repite la contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-4 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-4"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  Guardar Contraseña <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
