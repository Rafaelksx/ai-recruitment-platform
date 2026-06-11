'use client'

import { useState, useTransition } from 'react'
import { cancelApplication } from '@/app/actions/candidates'
import { XCircle, Loader2 } from 'lucide-react'

export function CancelApplicationButton({ candidateId }: { candidateId: string }) {
  const [isPending, startTransition] = useTransition()

  async function handleCancel() {
    if (!confirm('¿Estás seguro de que deseas retirar tu postulación? Esta acción no se puede deshacer.')) {
      return
    }

    startTransition(async () => {
      const result = await cancelApplication(candidateId)
      if (!result.success) {
        alert(result.error)
      } else {
        alert('Postulación retirada con éxito.')
      }
    })
  }

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors disabled:opacity-50"
    >
      {isPending ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
      Retirar mi postulación
    </button>
  )
}
