import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          
          <div className="text-lg sm:text-xl font-semibold">
            maisumporcento
          </div>

          <nav className="hidden md:flex items-center gap-8 text-neutral-600 text-sm">
            <div className="hover:text-neutral-900 cursor-pointer">Início</div>
            <div className="hover:text-neutral-900 cursor-pointer">Manifesto</div>
            <div className="hover:text-neutral-900 cursor-pointer">Recursos</div>
          </nav>

          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/login" className="text-sm sm:text-base text-neutral-600 hover:text-neutral-900">
              Entrar
            </Link>
            <Link href="/signup" className="btn-primary text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
              Começar
            </Link>
          </div>

        </div>
      </header>

      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-3xl text-center space-y-6 sm:space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 leading-tight">
            1% melhor<br />por dia
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto px-4">
            Um habit tracker minimalista que reforça consistência sobre intensidade. 
            Baseado nos princípios de Atomic Habits.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Link href="/signup" className="btn-primary text-sm sm:text-base">
              Criar conta gratuita
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-neutral-200 py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900">
                Consistência vence intensidade
              </h3>
              <p className="text-sm sm:text-base text-neutral-600">
                Pequenas ações repetidas diariamente geram resultados inevitáveis. 
                Não é sobre intensidade, é sobre aparecer todo dia.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900">
                Identidade, não metas
              </h3>
              <p className="text-sm sm:text-base text-neutral-600">
                Você não busca correr uma maratona. Você se torna uma pessoa que corre. 
                A mudança começa em quem você é.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900">
                Progresso sem punição
              </h3>
              <p className="text-sm sm:text-base text-neutral-600">
                A regra é não falhar duas vezes seguidas. Falhas fazem parte do processo. 
                O importante é voltar.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 sm:py-16 bg-neutral-50">
        <p className="text-center px-4 sm:px-6 text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto">
          Profissionais usam Habit Trackers para manter a consistência, produzir mais e melhor!
        </p>
      </section>

      <section id="como-funciona" className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-neutral-50 rounded-2xl p-6 sm:p-12 border border-neutral-100">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900">
                Como funciona
              </h1>
              <p className="text-neutral-600 text-sm sm:text-base md:text-lg">
                O <strong>maisumporcento</strong> existe para tirar o peso da mudança. Em vez de metas
                enormes e cobranças, ele organiza passos pequenos e visíveis. Você registra o que faz,
                percebe padrões e avança um pouco todos os dias: sem pressa, sem punição.
              </p>
            </div>

            <div className="mt-8 sm:mt-12 grid gap-6 sm:gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center px-4 sm:px-6">
                <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900">Registrar</h3>
                <p className="text-neutral-600 mt-2 text-xs sm:text-sm">
                  Marque o que você fez de forma simples e visual — sem configurações complexas.
                </p>
              </div>

              <div className="flex flex-col items-center text-center px-4 sm:px-6">
                <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900">Visualizar</h3>
                <p className="text-neutral-600 mt-2 text-xs sm:text-sm">
                  Veja o histórico e padrões em tabelas e gráficos simples — sem confusão.
                </p>
              </div>

              <div className="flex flex-col items-center text-center px-4 sm:px-6">
                <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900">Repetir</h3>
                <p className="text-neutral-600 mt-2 text-xs sm:text-sm">
                  Pequenos hábitos se acumulam. A ferramenta ajuda a transformar repetições em rotina.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-2 sm:py-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-neutral-50 rounded-2xl p-6 sm:p-12 border border-neutral-100">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              
              {/* Imagem */}
              <div className="flex justify-center md:justify-start">
                <img
                  src="/icons/office-worker.png"
                  alt="Ilustração de organização e foco"
                  className="w-56 sm:w-64 md:w-72"
                />
              </div>

              {/* Texto */}
              <div className="space-y-4 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900">
                  Torne-se organizado
                </h2>
                <p className="text-neutral-600 text-sm sm:text-base md:text-lg max-w-md mx-auto md:mx-0">
                  Organização não é rigidez! É Ter mais clareza.               
                </p>
                <p className="text-neutral-600 text-sm sm:text-base md:text-lg max-w-md mx-auto md:mx-0">
                  O maisumporcento ajuda você a enxergar seus hábitos com simplicidade,
                  transformando intenção em rotina: um dia de cada vez.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <footer className="mt-12 border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            
            {/* Left: brand + CTA */}
            <div className="flex flex-col items-start gap-4 md:max-w-xs">
              <div className="text-neutral-900 font-semibold text-base sm:text-lg">
                maisumporcento
              </div>

              <p className="text-sm text-neutral-600">
                1% melhor por dia. Consistência sobre intensidade.
              </p>

              <Link
                href="/signup"
                className="inline-block rounded-md px-4 py-2.5 text-sm font-medium bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow"
              >
                Criar conta gratuita
              </Link>
            </div>

            {/* Right: links */}
            <div className="grid grid-cols-2 gap-8 sm:gap-12">
              <div>
                <h4 className="text-xs font-semibold text-neutral-700 uppercase mb-3">
                  Empresa
                </h4>
                <ul className="space-y-2.5 text-sm text-neutral-600">
                  <li><Link href="#" className="hover:text-neutral-900 transition-colors">Sobre</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-neutral-700 uppercase mb-3">
                  Produto
                </h4>
                <ul className="space-y-2.5 text-sm text-neutral-600">
                  <li><Link href="#" className="hover:text-neutral-900 transition-colors">Recursos</Link></li>
                  <li><Link href="#" className="hover:text-neutral-900 transition-colors">Ajuda</Link></li>
                </ul>
              </div>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-xs sm:text-sm text-neutral-500">
              © {new Date().getFullYear()} maisumporcento, Inc.
            </div>
            
            <div className="text-xs sm:text-sm text-neutral-500">
              <Link href="#" className="hover:text-neutral-700 transition-colors">Termos</Link>
              <span className="mx-2">•</span>
              <Link href="#" className="hover:text-neutral-700 transition-colors">Privacidade</Link>
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}