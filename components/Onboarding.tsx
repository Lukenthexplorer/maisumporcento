'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/contexts/UserContext'
import { createClient } from '@/lib/supabase'
import { X, ArrowRight, Check, Target, TrendingUp, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface OnboardingStep {
  title: string
  description: string
  icon: React.ReactNode
  action?: {
    label: string
    href: string
  }
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    title: 'Bem-vindo ao maisumporcento',
    description: '1% melhor por dia. Um habit tracker minimalista focado em consistência, não em intensidade.',
    icon: <Target className="w-12 h-12 text-neutral-900" />,
  },
  {
    title: 'Crie seus hábitos',
    description: 'Comece pequeno. Escolha hábitos simples que levam menos de 2 minutos para completar.',
    icon: <TrendingUp className="w-12 h-12 text-neutral-900" />,
    action: {
      label: 'Criar primeiro hábito',
      href: '/goals',
    },
  },
  {
    title: 'Marque seu progresso',
    description: 'Todo dia, marque o que você fez. A consistência é mais importante que a perfeição.',
    icon: <Calendar className="w-12 h-12 text-neutral-900" />,
    action: {
      label: 'Ir para Hoje',
      href: '/dashboard',
    },
  },
]

export function Onboarding() {
  const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkOnboardingStatus()
  }, [user])

  const checkOnboardingStatus = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('completed, current_step, skipped')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Erro ao verificar onboarding:', error)
        setLoading(false)
        return
      }

      if (data && !data.completed && !data.skipped) {
        setCurrentStep(data.current_step || 0)
        setIsOpen(true)
      }
    } catch (error) {
      console.error('Erro ao carregar onboarding:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOnboardingStep = async (step: number) => {
    if (!user) return

    try {
      await supabase
        .from('user_onboarding')
        .update({ current_step: step })
        .eq('user_id', user.id)
    } catch (error) {
      console.error('Erro ao atualizar passo:', error)
    }
  }

  const completeOnboarding = async () => {
    if (!user) return

    try {
      await supabase
        .from('user_onboarding')
        .update({ 
          completed: true, 
          completed_at: new Date().toISOString() 
        })
        .eq('user_id', user.id)

      setIsOpen(false)
    } catch (error) {
      console.error('Erro ao completar onboarding:', error)
    }
  }

  const skipOnboarding = async () => {
    if (!user) return

    try {
      await supabase
        .from('user_onboarding')
        .update({ skipped: true })
        .eq('user_id', user.id)

      setIsOpen(false)
    } catch (error) {
      console.error('Erro ao pular onboarding:', error)
    }
  }

  const handleNext = async () => {
    const nextStep = currentStep + 1
    
    if (nextStep >= ONBOARDING_STEPS.length) {
      await completeOnboarding()
    } else {
      setCurrentStep(nextStep)
      await updateOnboardingStep(nextStep)
    }
  }

  const handleAction = async () => {
    const step = ONBOARDING_STEPS[currentStep]
    if (step.action) {
      await completeOnboarding()
      router.push(step.action.href)
    } else {
      await handleNext()
    }
  }

  if (loading || !isOpen) return null

  const step = ONBOARDING_STEPS[currentStep]
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative">
        {/* Botão fechar */}
        <button
          onClick={skipOnboarding}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Conteúdo */}
        <div className="text-center space-y-6">
          {/* Ícone */}
          <div className="flex justify-center">
            {step.icon}
          </div>

          {/* Título */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
              {step.title}
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Indicadores de progresso */}
          <div className="flex justify-center gap-2 pt-4">
            {ONBOARDING_STEPS.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-neutral-900'
                    : index < currentStep
                    ? 'w-2 bg-neutral-400'
                    : 'w-2 bg-neutral-200'
                }`}
              />
            ))}
          </div>

          {/* Botões */}
          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={handleAction}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {step.action ? step.action.label : 'Próximo'}
              {isLastStep ? (
                <Check className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>

            {currentStep > 0 && (
              <button
                onClick={() => {
                  setCurrentStep(currentStep - 1)
                  updateOnboardingStep(currentStep - 1)
                }}
                className="text-sm text-neutral-600 hover:text-neutral-900"
              >
                Voltar
              </button>
            )}
          </div>

          {/* Skip */}
          {currentStep === 0 && (
            <button
              onClick={skipOnboarding}
              className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              Pular tutorial
            </button>
          )}
        </div>
      </div>
    </div>
  )
}