import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

/**
 * Cliente do Supabase para Client Components
 * Use este cliente em componentes que rodam no navegador
 */
export const createClient = () => {
  return createClientComponentClient()
}

/**
 * Types do banco de dados
 */
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          title: string
          identity_label: string | null
          frequency: 'daily' | 'weekly'
          time_hint: string | null
          created_at: string
          active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          identity_label?: string | null
          frequency?: 'daily' | 'weekly'
          time_hint?: string | null
          created_at?: string
          active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          identity_label?: string | null
          frequency?: 'daily' | 'weekly'
          time_hint?: string | null
          created_at?: string
          active?: boolean
        }
      }
      habit_checks: {
        Row: {
          id: string
          habit_id: string
          date: string
          completed: boolean
        }
        Insert: {
          id?: string
          habit_id: string
          date: string
          completed?: boolean
        }
        Update: {
          id?: string
          habit_id?: string
          date?: string
          completed?: boolean
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          created_at?: string
        }
      }
      goal_habits: {
        Row: {
          goal_id: string
          habit_id: string
        }
        Insert: {
          goal_id: string
          habit_id: string
        }
        Update: {
          goal_id?: string
          habit_id?: string
        }
      }
    }
  }
}