import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          
          <div className="text-xl font-semibold">
            maisumporcento
          </div>

          <nav className="flex items-center gap-8 text-neutral-600">
            <div className="hover:text-neutral-900 cursor-pointer">Início</div>
            <div className="hover:text-neutral-900 cursor-pointer">Manifesto</div>
            <div className="hover:text-neutral-900 cursor-pointer">Recursos</div>
          </nav>

          <div className="flex items-center gap-8">
            <Link href="/login" className="text-neutral-600 hover:text-neutral-900">
              Entrar
            </Link>
            <Link href="/signup" className="btn-primary">
              Começar
            </Link>
          </div>

        </div>
      </header>
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 leading-tight">
            1% melhor<br />por dia
          </h1>
          
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Um habit tracker minimalista que reforça consistência sobre intensidade. 
            Baseado nos princípios de Atomic Habits.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Link href="/signup" className="btn-primary">
              Criar conta gratuita
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-neutral-200 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-900">
                Consistência vence intensidade
              </h3>
              <p className="text-neutral-600">
                Pequenas ações repetidas diariamente geram resultados inevitáveis. 
                Não é sobre intensidade, é sobre aparecer todo dia.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-900">
                Identidade, não metas
              </h3>
              <p className="text-neutral-600">
                Você não busca correr uma maratona. Você se torna uma pessoa que corre. 
                A mudança começa em quem você é.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-900">
                Progresso sem punição
              </h3>
              <p className="text-neutral-600">
                A regra é não falhar duas vezes seguidas. Falhas fazem parte do processo. 
                O importante é voltar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-200 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-neutral-500 text-sm">
          <p>maisumporcento.com.br – Pequenas ações. Resultados inevitáveis.</p>
        </div>
      </footer>
    </main>
  )
}