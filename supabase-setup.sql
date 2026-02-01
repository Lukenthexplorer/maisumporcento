-- ==========================================
-- MAISUMPORCENTO - Database Setup
-- ==========================================
-- Execute este script no SQL Editor do Supabase

-- 1. Criar tabela de usuários
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Criar tabela de hábitos
create table public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  identity_label text,
  frequency text not null default 'daily' check (frequency in ('daily', 'weekly')),
  time_hint text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  active boolean default true not null
);

-- 3. Criar tabela de checks de hábitos
create table public.habit_checks (
  id uuid default gen_random_uuid() primary key,
  habit_id uuid references public.habits(id) on delete cascade not null,
  date date not null,
  completed boolean default true not null,
  unique(habit_id, date)
);

-- 4. Criar tabela de objetivos
create table public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Criar tabela pivot para relacionar objetivos e hábitos
create table public.goal_habits (
  goal_id uuid references public.goals(id) on delete cascade not null,
  habit_id uuid references public.habits(id) on delete cascade not null,
  primary key (goal_id, habit_id)
);

-- ==========================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- ==========================================

alter table public.users enable row level security;
alter table public.habits enable row level security;
alter table public.habit_checks enable row level security;
alter table public.goals enable row level security;
alter table public.goal_habits enable row level security;

-- Políticas para users
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Políticas para habits
create policy "Users can view own habits"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "Users can insert own habits"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "Users can update own habits"
  on public.habits for update
  using (auth.uid() = user_id);

create policy "Users can delete own habits"
  on public.habits for delete
  using (auth.uid() = user_id);

-- Políticas para habit_checks
create policy "Users can view own habit checks"
  on public.habit_checks for select
  using (
    exists (
      select 1 from public.habits
      where habits.id = habit_checks.habit_id
      and habits.user_id = auth.uid()
    )
  );

create policy "Users can insert own habit checks"
  on public.habit_checks for insert
  with check (
    exists (
      select 1 from public.habits
      where habits.id = habit_checks.habit_id
      and habits.user_id = auth.uid()
    )
  );

create policy "Users can update own habit checks"
  on public.habit_checks for update
  using (
    exists (
      select 1 from public.habits
      where habits.id = habit_checks.habit_id
      and habits.user_id = auth.uid()
    )
  );

create policy "Users can delete own habit checks"
  on public.habit_checks for delete
  using (
    exists (
      select 1 from public.habits
      where habits.id = habit_checks.habit_id
      and habits.user_id = auth.uid()
    )
  );

-- Políticas para goals
create policy "Users can view own goals"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "Users can insert own goals"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own goals"
  on public.goals for update
  using (auth.uid() = user_id);

create policy "Users can delete own goals"
  on public.goals for delete
  using (auth.uid() = user_id);

-- Políticas para goal_habits
create policy "Users can view own goal_habits"
  on public.goal_habits for select
  using (
    exists (
      select 1 from public.goals
      where goals.id = goal_habits.goal_id
      and goals.user_id = auth.uid()
    )
  );

create policy "Users can insert own goal_habits"
  on public.goal_habits for insert
  with check (
    exists (
      select 1 from public.goals
      where goals.id = goal_habits.goal_id
      and goals.user_id = auth.uid()
    )
  );

create policy "Users can delete own goal_habits"
  on public.goal_habits for delete
  using (
    exists (
      select 1 from public.goals
      where goals.id = goal_habits.goal_id
      and goals.user_id = auth.uid()
    )
  );

-- ==========================================
-- ÍNDICES PARA PERFORMANCE
-- ==========================================

create index habits_user_id_idx on public.habits(user_id);
create index habit_checks_habit_id_idx on public.habit_checks(habit_id);
create index habit_checks_date_idx on public.habit_checks(date);
create index goals_user_id_idx on public.goals(user_id);

-- ==========================================
-- FUNÇÃO PARA AUTO-CRIAR PERFIL DE USUÁRIO
-- ==========================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Usuário'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();