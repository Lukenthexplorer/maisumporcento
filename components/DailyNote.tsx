'use client'

import { useEffect, useState, useCallback } from 'react'
import { useUser } from '@/contexts/UserContext'
import { createClient } from '@/lib/supabase'

/**
 * Componente de registro diário opcional
 * Aparece no final da aba "Hoje" sem criar fricção
 * Princípio: make it easy, make it satisfying
 */
export function DailyNote() {
  const { user } = useUser()
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null)
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

  // Carregar nota do dia ao montar
  useEffect(() => {
    loadNote()
  }, [user])

  const loadNote = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('daily_notes')
        .select('content')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar nota:', error)
        return
      }

      if (data) {
        setContent(data.content || '')
      }
    } catch (error) {
      // Silenciosamente falha - não atrapalha o uso do app
      console.error('Erro ao carregar nota:', error)
    }
  }

  // Salvar com debounce
  const saveNote = useCallback(async (text: string) => {
    if (!user) return

    setIsSaving(true)

    try {
      const { error } = await supabase
        .from('daily_notes')
        .upsert({
          user_id: user.id,
          date: today,
          content: text.trim(),
        }, {
          onConflict: 'user_id,date'
        })

      if (error) {
        console.error('Erro ao salvar nota:', error)
      }
    } catch (error) {
      // Silenciosamente falha - não atrapalha o uso do app
      console.error('Erro ao salvar nota:', error)
    } finally {
      setIsSaving(false)
    }
  }, [user, today, supabase])

  // Handler com debounce
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value

    // Limite de caracteres
    if (newContent.length > 500) return

    setContent(newContent)

    // Limpar timeout anterior
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    // Criar novo timeout para salvar
    const timeout = setTimeout(() => {
      if (newContent.trim()) {
        saveNote(newContent)
      }
    }, 800)

    setSaveTimeout(timeout)
  }

  // Cleanup do timeout ao desmontar
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout)
      }
    }
  }, [saveTimeout])

  return (
    <div className="mt-8 pt-8 border-t border-neutral-200">
      <div className="space-y-3">
        {/* Título discreto */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-neutral-700">
            Registrar o dia
          </h3>
          {isSaving && (
            <span className="text-xs text-neutral-400">Salvando...</span>
          )}
        </div>

        {/* Campo de texto */}
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
          />
          
          {/* Contador de caracteres - só aparece quando começa a digitar */}
          {content.length > 0 && (
            <div className="absolute bottom-2 right-2 text-xs text-neutral-400">
              {content.length}/500
            </div>
          )}
        </div>

        {/* Mensagem sutil apenas quando há conteúdo */}
        {content.trim().length > 0 && (
          <p className="text-xs text-neutral-500">
            Seu registro está seguro.
          </p>
        )}
      </div>
    </div>
  )
}