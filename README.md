# maisumporcento

Habit tracker minimalista focado em consistência, identidade e progresso incremental.

## 🚀 Setup Rápido

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar Supabase

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Vá em **SQL Editor** e execute todo o arquivo `supabase-setup.sql`
4. Copie suas credenciais em **Settings > API**

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione:
```
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 4. Rodar em desenvolvimento
```bash
npm run dev
```

Acesse: http://localhost:3000

## 📁 Estrutura
```
maisumporcento/
├── app/
│   ├── login/              # Login
│   ├── signup/             # Cadastro
│   ├── forgot-password/    # Recuperar senha
│   ├── reset-password/     # Redefinir senha
│   ├── dashboard/          # Dashboard principal
│   ├── progresso/          # Progresso (heatmap)
│   ├── goals/              # Objetivos e hábitos
│   ├── perfil/             # Perfil do usuário
│   └── api/auth/callback/  # Callback auth
├── components/             # Componentes React
├── contexts/               # Contextos (UserContext)
├── lib/                    # Supabase client
└── middleware.ts           # Proteção de rotas
```

## 🎯 Funcionalidades

- ✅ Autenticação completa (login, cadastro, recuperação)
- ✅ Dashboard minimalista
- ✅ Heatmap de progresso (GitHub-style)
- ✅ Gestão de objetivos e hábitos
- ✅ Perfil do usuário
- ✅ Design calmo e neutro

## 📦 Deploy

### Vercel

1. Push para GitHub
2. Importe projeto na Vercel
3. Adicione variáveis de ambiente
4. Deploy!

## 🛠 Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + Database)

---

**maisumporcento.com.br** – 1% melhor por dia