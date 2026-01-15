-- Migration: 001_create_tables
-- Tabelas para o sistema de clonagem de estilos do ORYOS

-- ============================================
-- TABELA: creators (Estilos salvos)
-- ============================================
create table if not exists public.creators (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,

  -- Info do canal
  channel_id text not null,
  channel_name text not null,
  channel_url text not null,
  avatar_url text,
  subscriber_count integer default 0,

  -- Nome personalizado do estilo
  style_name text not null,

  -- Videos analisados (array de IDs)
  video_ids text[] not null default '{}',
  total_videos_analyzed integer not null default 0,

  -- Analise estruturada (JSON completo)
  analysis jsonb not null default '{}',

  -- Prompt template gerado para uso na geracao
  prompt_template text not null default '',

  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  -- Constraints
  constraint unique_user_channel unique(user_id, channel_id)
);

-- Index para busca por usuario
create index if not exists idx_creators_user_id on public.creators(user_id);

-- RLS (Row Level Security)
alter table public.creators enable row level security;

-- Policies
create policy "Users can view own creators"
  on public.creators for select
  using (auth.uid() = user_id);

create policy "Users can insert own creators"
  on public.creators for insert
  with check (auth.uid() = user_id);

create policy "Users can update own creators"
  on public.creators for update
  using (auth.uid() = user_id);

create policy "Users can delete own creators"
  on public.creators for delete
  using (auth.uid() = user_id);


-- ============================================
-- TABELA: creator_videos (Videos analisados)
-- ============================================
create table if not exists public.creator_videos (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references public.creators(id) on delete cascade not null,

  -- Info do video
  video_id text not null,
  title text,
  url text not null,
  thumbnail_url text,
  duration_seconds integer default 0,
  view_count integer default 0,
  published_at timestamptz,

  -- Transcricao
  transcript text,
  transcript_language text default 'pt',
  word_count integer default 0,

  -- Status do processamento
  status text default 'pending' check (status in ('pending', 'transcribing', 'ready', 'error')),
  error_message text,

  -- Metadata
  created_at timestamptz default now(),

  -- Constraints
  constraint unique_creator_video unique(creator_id, video_id)
);

-- Index
create index if not exists idx_creator_videos_creator_id on public.creator_videos(creator_id);
create index if not exists idx_creator_videos_status on public.creator_videos(status);

-- RLS
alter table public.creator_videos enable row level security;

-- Policies (via creator ownership)
create policy "Users can view own creator videos"
  on public.creator_videos for select
  using (
    exists (
      select 1 from public.creators
      where creators.id = creator_videos.creator_id
      and creators.user_id = auth.uid()
    )
  );

create policy "Users can insert own creator videos"
  on public.creator_videos for insert
  with check (
    exists (
      select 1 from public.creators
      where creators.id = creator_videos.creator_id
      and creators.user_id = auth.uid()
    )
  );

create policy "Users can delete own creator videos"
  on public.creator_videos for delete
  using (
    exists (
      select 1 from public.creators
      where creators.id = creator_videos.creator_id
      and creators.user_id = auth.uid()
    )
  );


-- ============================================
-- TABELA: generated_scripts (Roteiros gerados)
-- ============================================
create table if not exists public.generated_scripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  creator_id uuid references public.creators(id) on delete set null,

  -- Input
  topic text not null,
  format text default 'youtube_long' check (format in ('youtube_long', 'youtube_short', 'reels', 'twitter_thread')),
  word_count_target integer,
  additional_instructions text,

  -- Output
  title_suggestion text,
  hook text,
  script_content text not null,
  thumbnail_ideas text[] default '{}',

  -- Metadata do output
  actual_word_count integer,
  estimated_duration_seconds integer,

  -- Feedback do usuario
  rating integer check (rating >= 1 and rating <= 5),
  is_favorite boolean default false,

  -- Metadata
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_generated_scripts_user_id on public.generated_scripts(user_id);
create index if not exists idx_generated_scripts_creator_id on public.generated_scripts(creator_id);
create index if not exists idx_generated_scripts_created_at on public.generated_scripts(created_at desc);

-- RLS
alter table public.generated_scripts enable row level security;

-- Policies
create policy "Users can view own scripts"
  on public.generated_scripts for select
  using (auth.uid() = user_id);

create policy "Users can insert own scripts"
  on public.generated_scripts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own scripts"
  on public.generated_scripts for update
  using (auth.uid() = user_id);

create policy "Users can delete own scripts"
  on public.generated_scripts for delete
  using (auth.uid() = user_id);


-- ============================================
-- TABELA: analysis_jobs (Jobs assincronos)
-- ============================================
create table if not exists public.analysis_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,

  -- Tipo do job
  type text not null check (type in ('channel_analysis', 'script_generation', 'batch_transcript')),
  status text default 'queued' check (status in ('queued', 'processing', 'completed', 'failed')),

  -- Configuracao do job (input)
  config jsonb not null default '{}',

  -- Progresso
  progress integer default 0 check (progress >= 0 and progress <= 100),
  current_step text,
  total_steps integer default 1,

  -- Resultado
  result jsonb,
  error_message text,

  -- Timestamps
  created_at timestamptz default now(),
  started_at timestamptz,
  completed_at timestamptz
);

-- Indexes
create index if not exists idx_analysis_jobs_user_id on public.analysis_jobs(user_id);
create index if not exists idx_analysis_jobs_status on public.analysis_jobs(status);

-- RLS
alter table public.analysis_jobs enable row level security;

-- Policies
create policy "Users can view own jobs"
  on public.analysis_jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert own jobs"
  on public.analysis_jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own jobs"
  on public.analysis_jobs for update
  using (auth.uid() = user_id);


-- ============================================
-- TABELA: user_usage (Controle de uso/limites)
-- ============================================
create table if not exists public.user_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,

  -- Contadores do mes atual
  analyses_this_month integer default 0,
  scripts_this_month integer default 0,
  transcripts_this_month integer default 0,

  -- Periodo de contagem
  current_period_start timestamptz default date_trunc('month', now()),

  -- Limites (podem ser sobrescritos por plano)
  max_analyses_per_month integer default 1,
  max_scripts_per_month integer default 5,
  max_creators_saved integer default 1,

  -- Plano
  plan text default 'free' check (plan in ('free', 'pro', 'business')),
  plan_expires_at timestamptz,

  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index
create index if not exists idx_user_usage_user_id on public.user_usage(user_id);

-- RLS
alter table public.user_usage enable row level security;

-- Policies
create policy "Users can view own usage"
  on public.user_usage for select
  using (auth.uid() = user_id);

create policy "Users can update own usage"
  on public.user_usage for update
  using (auth.uid() = user_id);


-- ============================================
-- FUNCTIONS
-- ============================================

-- Funcao para criar registro de usage quando usuario e criado
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_usage (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger para criar usage automaticamente
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Funcao para resetar contadores mensais
create or replace function public.reset_monthly_usage()
returns void as $$
begin
  update public.user_usage
  set
    analyses_this_month = 0,
    scripts_this_month = 0,
    transcripts_this_month = 0,
    current_period_start = date_trunc('month', now()),
    updated_at = now()
  where current_period_start < date_trunc('month', now());
end;
$$ language plpgsql security definer;

-- Funcao para atualizar updated_at automaticamente
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers para updated_at
create trigger update_creators_updated_at
  before update on public.creators
  for each row execute procedure public.update_updated_at();

create trigger update_user_usage_updated_at
  before update on public.user_usage
  for each row execute procedure public.update_updated_at();


-- ============================================
-- GRANTS
-- ============================================
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant execute on all functions in schema public to anon, authenticated;
