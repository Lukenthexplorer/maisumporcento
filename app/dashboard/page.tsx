'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useUser } from '@/contexts/UserContext'
import { createClient } from '@/lib/supabase'

/**
 * Componente de registro diário opcional (versão com debounce via ref)
 */
export function DailyNote() {
  const { user } = useUser()
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const saveTimeoutRef = useRef<number | null>(null)
  const supabase = createClient()

  const today = new Date().toISOString().split('T')[0]

  // Prompts rotativos - escolhe um baseado no dia
  const prompts = [
    "Uma coisa que valeu a pena hoje:",
    "Algo pequeno que aprendi hoje:",
    "O que funcionou hoje?",
  ]
  const promptIndex = new Date().getDate() % prompts.length
  const currentPrompt = prompts[promptIndex]

  // Carregar nota do dia ao montar (ou quando user mudar)
  useEffect(() => {
    const loadNote = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('daily_notes')
          .select('content')
          .eq('user_id', user.id)
          .eq('date', today)
          .maybeSingle()

        if (error && (error as any).code !== 'PGRST116') {
          console.error('Erro ao carregar nota:', error)
          return
        }

        if (data) {
          setContent(data.content || '')
        } else {
          setContent('')
        }
      } catch (err) {
        console.error('Erro ao carregar nota:', err)
      }
    }

    loadNote()

    return () => {
      // cleanup se necessário
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
    // Intentional: dependemos só de user e today
  }, [user, today, supabase])

  // Salvar a nota (upsert). Deixo upsert para simplicidade.
  const saveNote = useCallback(async (text: string) => {
    if (!user) return

    setIsSaving(true)
    try {
      const cleaned = text.trim()

      if (cleaned.length === 0) {
        // opcional: deletar nota quando vazia
        // await supabase.from('daily_notes').delete().match({ user_id: user.id, date: today })
        // return
      }

      const { error } = await supabase
        .from('daily_notes')
        .upsert(
          {
            user_id: user.id,
            date: today,
            content: cleaned,
          },
          { onConflict: 'user_id,date' }
        )

      if (error) {
        console.error('Erro ao salvar nota:', error)
      }
    } catch (err) {
      console.error('Erro ao salvar nota:', err)
    } finally {
      setIsSaving(false)
    }
  }, [user, today, supabase])

  // Handler com debounce via ref
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value

    if (newContent.length > 500) return

    setContent(newContent)

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    // window.setTimeout retorna number no browser; guardamos como number
    saveTimeoutRef.current = window.setTimeout(() => {
      // só salvamos quando tiver algo trimado — evita criar linhas só com espaços
      if (newContent.trim().length > 0) {
        saveNote(newContent)
      } else {
        // opcional: se quiser deletar a nota quando o usuário apagar tudo, descomente:
        // saveNote('') ou chamada específica de delete no supabase
      }
      saveTimeoutRef.current = null
    }, 800)
  }

  // cleanup no unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="mt-8 pt-8 border-t border-neutral-200">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-neutral-700">Registrar o dia</h3>
          {isSaving && <span className="text-xs text-neutral-400">Salvando...</span>}
        </div>

        <div className="relative">
          <textarea
            value={content}
            onChange={handleChange}
            placeholder={currentPrompt}
            className="w-full px-4 py-3 border border-neutral-200 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-transparent
                     resize-none text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400
                     transition-all"
            rows={3}
            maxLength={500}
            aria-label="Registro diário"
          />

          {content.length > 0 && (
            <div className="absolute bottom-2 right-2 text-xs text-neutral-400">
              {content.length}/500
            </div>
          )}
        </div>

        {content.trim().length > 0 && (
          <p className="text-xs text-neutral-500">Seu registro está seguro.</p>
        )}
      </div>
    </div>
  )
}

export default DailyNote
