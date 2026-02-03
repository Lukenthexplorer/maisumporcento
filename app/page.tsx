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
      
      <section>
      <p className="flex-1 flex items-center justify-center px-6 py-20">
            Profissionais usam Habit Trackers para manter a consistência, produzir mais e melhor!
          </p>
      </section>

      <section id="como-funciona" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-neutral-50 rounded-2xl p-12 border border-neutral-100">
            {/* Título e subtítulo */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900">
                Como funciona
              </h1>
              <p className="text-neutral-600 text-base md:text-lg">
                O <strong>maisumporcento</strong> existe para tirar o peso da mudança. Em vez de metas
                enormes e cobranças, ele organiza passos pequenos e visíveis. Você registra o que faz,
                percebe padrões e avança um pouco todos os dias: sem pressa, sem punição.
              </p>
            </div>

            {/* Cards */}
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center px-6">
                <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-4">
                  {/* ícone simples */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">Registrar</h3>
                <p className="text-neutral-600 mt-2 text-sm">
                  Marque o que você fez de forma simples e visual — sem configurações complexas.
                </p>
              </div>

              <div className="flex flex-col items-center text-center px-6">
                <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">Visualizar</h3>
                <p className="text-neutral-600 mt-2 text-sm">
                  Veja o histórico e padrões em tabelas e gráficos simples — sem confusão.
                </p>
              </div>

              <div className="flex flex-col items-center text-center px-6">
                <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">Repetir</h3>
                <p className="text-neutral-600 mt-2 text-sm">
                  Pequenos hábitos se acumulam. A ferramenta ajuda a transformar repetições em rotina.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-12 border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-[50px] py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left: brand + CTA + copyright */}
            <div className="md:col-span-4">
              <div className="flex flex-col items-start gap-4">
                <div className="text-neutral-900 font-semibold text-lg">
                  maisumporcento
                </div>

                <div>
                  <a
                    href="/signup"
                    className="inline-block rounded-md px-3.5 py-2 text-sm font-medium bg-white border border-neutral-200 shadow-sm hover:shadow-md"
                  >
                    Criar conta gratuita
                  </a>
                </div>

                <div className="text-sm text-neutral-600 mt-2">
                  © {new Date().getFullYear()} maisumporcento, Inc.
                </div>
              </div>
            </div>

            {/* Right: link columns */}
            <div className="md:col-span-8 flex justify-end">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-xs font-semibold text-neutral-700 uppercase mb-3">
                    Empresa
                  </h4>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li><a href="#" className="hover:text-neutral-900">Sobre</a></li>
                    <li><a href="#" className="hover:text-neutral-900">Blog</a></li>
                    <li><a href="#" className="hover:text-neutral-900">Carreiras</a></li>
                    <li><a href="#" className="hover:text-neutral-900">Contato</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-neutral-700 uppercase mb-3">
                    Produto
                  </h4>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li><a href="#" className="hover:text-neutral-900">Recursos</a></li>
                    <li><a href="#" className="hover:text-neutral-900">Preços</a></li>
                    <li><a href="#" className="hover:text-neutral-900">Ajuda</a></li>
                    <li><a href="#" className="hover:text-neutral-900">Changelog</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-neutral-700 uppercase mb-3">
                    Casos
                  </h4>
                  <ul className="space-y-2 text-sm text-neutral-600">
                    <li><a href="#" className="hover:text-neutral-900">Pessoas</a></li>
                    <li><a href="#" className="hover:text-neutral-900">Equipes</a></li>
                    <li><a href="#" className="hover:text-neutral-900">Estudantes</a></li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="bg-neutral-100 border-t border-neutral-200">
          <div className="max-w-6xl mx-auto px-[50px] py-3 text-xs text-neutral-500">
            Termos • Privacidade
          </div>
        </div>
      </footer>

    </main>
  )
}