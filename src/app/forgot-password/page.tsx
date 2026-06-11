'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { resetPassword } from '@/app/auth/actions'
import { Sparkles, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await resetPassword(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(true)
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
            <Link href="/" className="flex items-center gap-2 mb-6 hover:scale-105 transition-transform">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--color-cyan-main)] to-[var(--color-salmon-main)] flex items-center justify-center text-white shadow-lg">
                <Sparkles size={20} />
              </div>
              <span className="font-bold text-2xl tracking-tight">TalentAI</span>
            </Link>
            <h2 className="text-2xl font-bold text-foreground text-center">Recuperar contraseña</h2>
            <p className="text-sm text-foreground/60 mt-2 text-center">
              Ingresa tu correo y te enviaremos un enlace para restablecerla.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-500/30">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-bold text-lg">Revisa tu bandeja de entrada</h3>
              <p className="text-sm text-muted-foreground">Te hemos enviado un enlace mágico para restablecer tu contraseña. Recuerda revisar la carpeta de Spam.</p>
              <Link href="/login" className="inline-block mt-4 text-sm font-bold text-cyan-600 hover:underline">
                Volver al Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-foreground/75 uppercase tracking-wider mb-2" htmlFor="email">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/20 dark:bg-black/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-medium text-sm text-foreground"
                  placeholder="tu@correo.com"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 px-4 rounded-xl bg-foreground text-background font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Enviando enlace...
                  </>
                ) : (
                  <>
                    Enviar Enlace <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="text-center pt-4">
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors">
                  Volver al login
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
