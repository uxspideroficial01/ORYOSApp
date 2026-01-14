-- ORYOS - Schema do Supabase
-- Channel Analytics + Creator Cloning
-- Execute este SQL no Supabase SQL Editor

-- Extensões
create extension if not exists "uuid-ossp";

-- Tabela de Canais do YouTube
create table if not exists public.youtube_channels (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  channel_id text not null,
  channel_name text not null,
  channel_url text not null,
  subscriber_count bigint,
  video_count bigint,
  description text,
  thumbnail_url text,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'pending' check (status in ('pending', 'analyzing', 'completed', 'error')),
  unique(user_id, channel_id)
);

-- Tabela de Vídeos analisados
create table if not exists public.youtube_videos (
  id uuid default uuid_generate_v4() primary key,
  channel_id uuid references public.youtube_channels(id) on delete cascade not null,
  video_id text not null,
  title text not null,
  description text,
  duration integer,
  view_count bigint,
  published_at timestamp with time zone,
  thumbnail_url text,
  transcript text,
  transcript_language text,
  fetched_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(channel_id, video_id)
);

-- Tabela de Análise individual de vídeos
create table if not exists public.video_analysis (
  id uuid default uuid_generate_v4() primary key,
  video_id uuid references public.youtube_videos(id) on delete cascade not null,
  channel_id uuid references public.youtube_channels(id) on delete cascade not null,

  structure jsonb not null,
  tone_analysis jsonb not null,
  patterns jsonb not null,
  narrative_elements jsonb not null,
  techniques jsonb not null,

  analyzed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  analysis_model text default 'claude-3-5-sonnet-20241022',

  unique(video_id)
);

-- Tabela do Modelo Híbrido
create table if not exists public.hybrid_models (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text,

  channel_ids uuid[] not null,

  hybrid_structure jsonb not null,
  hybrid_tone jsonb not null,
  hybrid_patterns jsonb not null,
  hybrid_techniques jsonb not null,

  prompt_template text not null,

  total_videos_analyzed integer not null,
  total_channels integer not null,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  unique(user_id, name)
);

-- Tabela de Jobs
create table if not exists public.analysis_jobs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  type text not null check (type in ('channel_analysis', 'model_generation')),
  status text default 'queued' check (status in ('queued', 'processing', 'completed', 'failed')),

  config jsonb not null,

  progress integer default 0,
  current_step text,

  result jsonb,
  error_message text,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  started_at timestamp with time zone,
  completed_at timestamp with time zone
);

-- Índices
create index if not exists idx_channels_user_id on public.youtube_channels(user_id);
create index if not exists idx_channels_status on public.youtube_channels(status);
create index if not exists idx_videos_channel_id on public.youtube_videos(channel_id);
create index if not exists idx_analysis_channel_id on public.video_analysis(channel_id);
create index if not exists idx_models_user_id on public.hybrid_models(user_id);
create index if not exists idx_jobs_user_id on public.analysis_jobs(user_id);
create index if not exists idx_jobs_status on public.analysis_jobs(status);

-- RLS Policies
alter table public.youtube_channels enable row level security;
alter table public.youtube_videos enable row level security;
alter table public.video_analysis enable row level security;
alter table public.hybrid_models enable row level security;
alter table public.analysis_jobs enable row level security;

-- Policies para youtube_channels
create policy "Users can view their own channels"
  on public.youtube_channels for select
  using (auth.uid() = user_id);

create policy "Users can insert their own channels"
  on public.youtube_channels for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own channels"
  on public.youtube_channels for update
  using (auth.uid() = user_id);

create policy "Users can delete their own channels"
  on public.youtube_channels for delete
  using (auth.uid() = user_id);

-- Policies para hybrid_models
create policy "Users can view their own models"
  on public.hybrid_models for select
  using (auth.uid() = user_id);

create policy "Users can insert their own models"
  on public.hybrid_models for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own models"
  on public.hybrid_models for update
  using (auth.uid() = user_id);

create policy "Users can delete their own models"
  on public.hybrid_models for delete
  using (auth.uid() = user_id);

-- Policies para analysis_jobs
create policy "Users can view their own jobs"
  on public.analysis_jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own jobs"
  on public.analysis_jobs for insert
  with check (auth.uid() = user_id);

-- ============================================
-- CREATOR CLONING TABLES
-- ============================================

-- Tabela de Creators Clonados
create table if not exists public.cloned_creators (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text,

  channel_id text not null,
  channel_name text not null,
  channel_url text not null,
  avatar_url text,

  video_ids text[] not null,
  total_videos integer not null,

  analysis jsonb not null,
  prompt_template text not null,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  unique(user_id, name)
);

-- Tabela de Roteiros Gerados
create table if not exists public.generated_scripts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  creator_id uuid references public.cloned_creators(id) on delete cascade not null,

  topic text not null,
  format text not null,

  script jsonb not null,
  estimated_duration_seconds integer,
  word_count integer,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de Jobs de Cloning
create table if not exists public.cloning_jobs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  type text not null check (type in ('creator_analysis', 'script_generation')),
  status text default 'queued' check (status in ('queued', 'processing', 'completed', 'failed')),

  config jsonb not null,
  progress integer default 0,
  current_step text,

  result jsonb,
  error_message text,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  started_at timestamp with time zone,
  completed_at timestamp with time zone
);

-- Índices
create index if not exists idx_creators_user_id on public.cloned_creators(user_id);
create index if not exists idx_scripts_user_id on public.generated_scripts(user_id);
create index if not exists idx_scripts_creator_id on public.generated_scripts(creator_id);
create index if not exists idx_cloning_jobs_user_id on public.cloning_jobs(user_id);
create index if not exists idx_cloning_jobs_status on public.cloning_jobs(status);

-- RLS Policies
alter table public.cloned_creators enable row level security;
alter table public.generated_scripts enable row level security;
alter table public.cloning_jobs enable row level security;

-- Policies para cloned_creators
create policy "Users can view their own creators"
  on public.cloned_creators for select
  using (auth.uid() = user_id);

create policy "Users can insert their own creators"
  on public.cloned_creators for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own creators"
  on public.cloned_creators for update
  using (auth.uid() = user_id);

create policy "Users can delete their own creators"
  on public.cloned_creators for delete
  using (auth.uid() = user_id);

-- Policies para generated_scripts
create policy "Users can view their own scripts"
  on public.generated_scripts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own scripts"
  on public.generated_scripts for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own scripts"
  on public.generated_scripts for delete
  using (auth.uid() = user_id);

-- Policies para cloning_jobs
create policy "Users can view their own cloning jobs"
  on public.cloning_jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own cloning jobs"
  on public.cloning_jobs for insert
  with check (auth.uid() = user_id);

-- Trigger para updated_at em cloned_creators
create trigger set_creators_updated_at
  before update on public.cloned_creators
  for each row
  execute function public.handle_updated_at();
