import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex justify-between items-center">
          
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

      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
        <div className="max-w-3xl text-center space-y-8 sm:space-y-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-900 leading-tight">
            1% melhor<br />por dia
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto px-4 leading-relaxed">
            Um habit tracker minimalista que reforça consistência sobre intensidade. 
            Baseado nos princípios de Atomic Habits.
          </p>

          <div className="flex gap-4 justify-center pt-6">
            <Link href="/signup" className="btn-primary text-sm sm:text-base">
              Criar conta gratuita
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-neutral-200 py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 sm:gap-12 lg:gap-16">
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900">
                Consistência vence intensidade
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Pequenas ações repetidas diariamente geram resultados inevitáveis. 
                Não é sobre intensidade, é sobre aparecer todo dia.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900">
                Identidade, não metas
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Você não busca correr uma maratona. Você se torna uma pessoa que corre. 
                A mudança começa em quem você é.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900">
                Progresso sem punição
              </h3>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                A regra é não falhar duas vezes seguidas. Falhas fazem parte do processo. 
                O importante é voltar.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 sm:py-20 bg-neutral-50">
        <div className="space-y-8">
          <p className="text-center px-4 sm:px-6 text-sm sm:text-base font-semibold text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Profissionais usam Habit Trackers para manter a consistência, produzir mais e melhor!
          </p>
          {/* Ícones */}
          <div className="flex justify-center gap-8 sm:gap-10">
            {/* Lápis */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                <svg width="28px" height="28px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="text-neutral-600">
                    <g>
                        <path fill="none" d="M0 0h24v24H0z"/>
                        <path fill="currentColor" d="M15.728 9.686l-1.414-1.414L5 17.586V19h1.414l9.314-9.314zm1.414-1.414l1.414-1.414-1.414-1.414-1.414 1.414 1.414 1.414zM7.242 21H3v-4.243L16.435 3.322a1 1 0 0 1 1.414 0l2.829 2.829a1 1 0 0 1 0 1.414L7.243 21z"/>
                    </g>
                </svg>
              </div>

            {/* Caderno */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
              <svg
                viewBox="0 0 32 32"
                className="w-7 h-7 text-neutral-600"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 1v5H3v2h2v4H3v2h2v4H3v2h2v4H3v2h2v5h24V1H5zM7 29v-3h2v-2H7v-4h2v-2H7v-4h2v-2H7V8h2V6H7V3h16v26H7zM27 29h-2V3h2V29z" />
              </svg>
            </div>

            {/* Cérebro */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 text-neutral-600"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
              >
                <path d="M22,11A4,4,0,0,0,20,7.52,3,3,0,0,0,20,7a3,3,0,0,0-3-3l-.18,0A3,3,0,0,0,12,2.78,3,3,0,0,0,7.18,4L7,4A3,3,0,0,0,4,7a3,3,0,0,0,0,.52,4,4,0,0,0-.55,6.59A4,4,0,0,0,7,20l.18,0A3,3,0,0,0,12,21.22,3,3,0,0,0,16.82,20L17,20a4,4,0,0,0,3.5-5.89A4,4,0,0,0,22,11ZM11,8.55a4.72,4.72,0,0,0-.68-.32,1,1,0,0,0-.64,1.9A2,2,0,0,1,11,12v1.55a4.72,4.72,0,0,0-.68-.32,1,1,0,0,0-.64,1.9A2,2,0,0,1,11,17v2a1,1,0,0,1-1,1,1,1,0,0,1-.91-.6,4.07,4.07,0,0,0,.48-.33,1,1,0,1,0-1.28-1.54A2,2,0,0,1,7,18a2,2,0,0,1-2-2,2,2,0,0,1,.32-1.06A3.82,3.82,0,0,0,6,15a1,1,0,0,0,0-2,1.84,1.84,0,0,1-.69-.13A2,2,0,0,1,5,9.25a3.1,3.1,0,0,0,.46.35,1,1,0,1,0,1-1.74.9.9,0,0,1-.34-.33A.92.92,0,0,1,6,7,1,1,0,0,1,7,6a.76.76,0,0,1,.21,0,3.85,3.85,0,0,0,.19.47,1,1,0,0,0,1.37.37A1,1,0,0,0,9.13,5.5,1.06,1.06,0,0,1,9,5a1,1,0,0,1,2,0Zm7.69,4.32A1.84,1.84,0,0,1,18,13a1,1,0,0,0,0,2,3.82,3.82,0,0,0,.68-.06A2,2,0,0,1,19,16a2,2,0,0,1-2,2,2,2,0,0,1-1.29-.47,1,1,0,0,0-1.28,1.54,4.07,4.07,0,0,0,.48.33A1,1,0,0,1,14,20a1,1,0,0,1-1-1V17a2,2,0,0,1,1.32-1.87,1,1,0,0,0-.64-1.9,4.72,4.72,0,0,0-.68.32V12a2,2,0,0,1,1.32-1.87,1,1,0,0,0-.64-1.9,4.72,4.72,0,0,0-.68.32V5a1,1,0,0,1,2,0,1.06,1.06,0,0,1-.13.5,1,1,0,0,0,.36,1.37A1,1,0,0,0,16.6,6.5,3.85,3.85,0,0,0,16.79,6,.76.76,0,0,1,17,6a1,1,0,0,1,1,1,1,1,0,0,1-.17.55.9.9,0,0,1-.33.31,1,1,0,0,0,1,1.74A2.66,2.66,0,0,0,19,9.25a2,2,0,0,1-.27,3.62Z"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-16 sm:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-neutral-50 rounded-2xl p-8 sm:p-10 lg:p-12 border border-neutral-100">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900">
                Como funciona
              </h1>
              <p className="text-neutral-600 text-sm sm:text-base md:text-lg leading-relaxed">
                O <strong>maisumporcento</strong> existe para tirar o peso da mudança. Em vez de metas
                enormes e cobranças, ele organiza passos pequenos e visíveis. Você registra o que faz,
                percebe padrões e avança um pouco todos os dias: sem pressa, sem punição.
              </p>
            </div>

            <div className="mt-12 sm:mt-16 lg:mt-20 grid gap-8 sm:gap-10 lg:gap-12 md:grid-cols-3">
              <div className="flex flex-col items-center text-center px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-5 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3">Registrar</h3>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                  Marque o que você fez de forma simples e visual — sem configurações complexas.
                </p>
              </div>

              <div className="flex flex-col items-center text-center px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-5 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3">Visualizar</h3>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                  Veja o histórico e padrões em tabelas e gráficos simples — sem confusão.
                </p>
              </div>

              <div className="flex flex-col items-center text-center px-4 sm:px-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-5 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3">Repetir</h3>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                  Pequenos hábitos se acumulam. A ferramenta ajuda a transformar repetições em rotina.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-neutral-50 rounded-2xl p-8 sm:p-12 lg:p-16 border border-neutral-100">
            <div className="grid gap-12 md:gap-16 lg:gap-20 md:grid-cols-2 items-center">
              
              {/* Imagem */}
              <div className="flex justify-center md:justify-start">
                <img
                  src="/icons/office-worker.png"
                  alt="Ilustração de organização e foco"
                  className="w-56 sm:w-64 md:w-72 lg:w-80"
                />
              </div>

              {/* Texto */}
              <div className="space-y-6 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900 leading-tight">
                  Torne-se organizado
                </h2>
                <p className="text-neutral-600 text-sm sm:text-base md:text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
                  Organização não é rigidez! É Ter mais clareza.               
                </p>
                <p className="text-neutral-600 text-sm sm:text-base md:text-lg max-w-md mx-auto md:mx-0 leading-relaxed">
                  O maisumporcento ajuda você a enxergar seus hábitos com simplicidade,
                  transformando intenção em rotina: um dia de cada vez.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <footer className="mt-16 sm:mt-20 border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
            
            {/* Left: brand + CTA */}
            <div className="flex flex-col items-start gap-5 md:max-w-xs">
              <div className="text-neutral-900 font-semibold text-base sm:text-lg">
                maisumporcento
              </div>

              <p className="text-sm text-neutral-600 leading-relaxed">
                1% melhor por dia. Consistência sobre intensidade.
              </p>

              <Link
                href="/signup"
                className="inline-block rounded-md px-5 py-3 text-sm font-medium bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow"
              >
                Criar conta gratuita
              </Link>
            </div>

            {/* Right: links */}
            <div className="grid grid-cols-2 gap-12 sm:gap-16">
              <div>
                <h4 className="text-xs font-semibold text-neutral-700 uppercase mb-4">
                  Empresa
                </h4>
                <ul className="space-y-3 text-sm text-neutral-600">
                  <li><Link href="#" className="hover:text-neutral-900 transition-colors">Sobre</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-neutral-700 uppercase mb-4">
                  Produto
                </h4>
                <ul className="space-y-3 text-sm text-neutral-600">
                  <li><Link href="#" className="hover:text-neutral-900 transition-colors">Recursos</Link></li>
                  <li><Link href="#" className="hover:text-neutral-900 transition-colors">Ajuda</Link></li>
                </ul>
              </div>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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