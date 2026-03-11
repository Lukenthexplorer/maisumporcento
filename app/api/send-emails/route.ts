import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Cliente Supabase com service role (para acesso admin)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { type } = await request.json()

    if (type === 'daily_reminder') {
      await sendDailyReminders()
    } else if (type === 'weekly_summary') {
      await sendWeeklySummaries()
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao enviar emails:', error)
    return NextResponse.json({ error: 'Erro ao enviar emails' }, { status: 500 })
  }
}

async function sendDailyReminders() {
  // Buscar usuários que querem lembrete diário
  const { data: users, error } = await supabaseAdmin
    .from('email_preferences')
    .select('user_id, daily_reminder_time')
    .eq('daily_reminder', true)

  if (error || !users) {
    console.error('Erro ao buscar preferências:', error)
    return
  }

  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  for (const pref of users) {
    const [hour, minute] = pref.daily_reminder_time.split(':').map(Number)
    
    // Verificar se é a hora certa (±15 minutos)
    if (Math.abs(currentHour - hour) === 0 && Math.abs(currentMinute - minute) < 15) {
      await sendDailyReminderEmail(pref.user_id)
    }
  }
}

async function sendDailyReminderEmail(userId: string) {
  // Buscar dados do usuário
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('name')
    .eq('id', userId)
    .single()

  const { data: authData } = await supabaseAdmin.auth.admin.getUserById(userId)

  // Verificações de segurança
  if (!authData?.user?.email) return

  // Buscar hábitos ativos
  const { data: habits } = await supabaseAdmin
    .from('habits')
    .select('title')
    .eq('user_id', userId)
    .eq('active', true)

  const habitCount = habits?.length || 0

  // Enviar email via Resend
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    console.error('RESEND_API_KEY não configurada')
    return
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'maisumporcento <noreply@maisumporcento.com.br>',
        to: authData.user.email,
        subject: '✨ Seus hábitos de hoje',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #171717; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 40px 20px; }
                .header h1 { font-size: 28px; margin: 0; }
                .content { background: #f5f5f5; border-radius: 12px; padding: 30px; margin: 20px 0; }
                .button { display: inline-block; background: #171717; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; margin: 20px 0; }
                .footer { text-align: center; color: #737373; font-size: 12px; padding: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Olá, ${user?.name || 'usuário'}!</h1>
                </div>
                <div class="content">
                  <p>Você tem <strong>${habitCount} hábito${habitCount !== 1 ? 's' : ''}</strong> para marcar hoje.</p>
                  <p>Lembre-se: consistência vence intensidade. 1% melhor por dia.</p>
                  <center>
                    <a href="https://maisumporcento.com.br/dashboard" class="button">
                      Marcar hábitos
                    </a>
                  </center>
                </div>
                <div class="footer">
                  <p>Você está recebendo este email porque ativou lembretes diários.</p>
                  <p><a href="https://maisumporcento.com.br/perfil">Alterar preferências</a></p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    })

    if (!response.ok) {
      console.error('Erro ao enviar email via Resend:', await response.text())
    }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
  }
}

async function sendWeeklySummaries() {
  // Buscar usuários que querem resumo semanal
  const { data: users, error } = await supabaseAdmin
    .from('email_preferences')
    .select('user_id, weekly_summary_day')
    .eq('weekly_summary', true)

  if (error || !users) return

  const today = new Date().getDay() // 0=domingo, 1=segunda, etc

  for (const pref of users) {
    if (pref.weekly_summary_day === today) {
      await sendWeeklySummaryEmail(pref.user_id)
    }
  }
}

async function sendWeeklySummaryEmail(userId: string) {
  // Buscar dados do usuário
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('name')
    .eq('id', userId)
    .single()

  const { data: authData } = await supabaseAdmin.auth.admin.getUserById(userId)

  // Verificações de segurança
  if (!authData?.user?.email) return

  // Calcular estatísticas da semana
  const today = new Date()
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  const { data: habits } = await supabaseAdmin
    .from('habits')
    .select('id, title')
    .eq('user_id', userId)
    .eq('active', true)

  if (!habits || habits.length === 0) return

  const { data: checks } = await supabaseAdmin
    .from('habit_checks')
    .select('habit_id, date, completed')
    .in('habit_id', habits.map(h => h.id))
    .gte('date', weekAgo.toISOString().split('T')[0])
    .eq('completed', true)

  const totalPossible = habits.length * 7
  const totalCompleted = checks?.length || 0
  const completionRate = Math.round((totalCompleted / totalPossible) * 100)

  // Enviar email via Resend
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) return

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'maisumporcento <noreply@maisumporcento.com.br>',
        to: authData.user.email,
        subject: '📊 Seu resumo semanal',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #171717; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; padding: 40px 20px; }
                .header h1 { font-size: 28px; margin: 0; }
                .content { background: #f5f5f5; border-radius: 12px; padding: 30px; margin: 20px 0; }
                .stat { text-align: center; padding: 20px; }
                .stat-number { font-size: 48px; font-weight: bold; color: #171717; }
                .stat-label { color: #737373; font-size: 14px; }
                .button { display: inline-block; background: #171717; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; margin: 20px 0; }
                .footer { text-align: center; color: #737373; font-size: 12px; padding: 20px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Resumo da sua semana</h1>
                </div>
                <div class="content">
                  <p>Olá, ${user?.name || 'usuário'}!</p>
                  <p>Aqui está como foi sua semana:</p>
                  
                  <div class="stat">
                    <div class="stat-number">${completionRate}%</div>
                    <div class="stat-label">Taxa de conclusão</div>
                  </div>
                  
                  <p style="text-align: center;">
                    <strong>${totalCompleted}</strong> de <strong>${totalPossible}</strong> hábitos completados
                  </p>
                  
                  <center>
                    <a href="https://maisumporcento.com.br/progresso" class="button">
                      Ver progresso completo
                    </a>
                  </center>
                </div>
                <div class="footer">
                  <p>Continue assim! Consistência vence intensidade.</p>
                  <p><a href="https://maisumporcento.com.br/perfil">Alterar preferências de email</a></p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    })
  } catch (error) {
    console.error('Erro ao enviar resumo semanal:', error)
  }
}