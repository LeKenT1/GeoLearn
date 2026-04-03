-- ─── GeoLearn — Schéma Supabase ──────────────────────────────────────────────
-- À coller dans l'éditeur SQL de votre projet Supabase :
-- https://supabase.com/dashboard/project/VOTRE_ID/sql/new
--
-- Ce script est idempotent : safe à relancer si la table existe déjà.
-- ─────────────────────────────────────────────────────────────────────────────

-- Table principale (créée seulement si elle n'existe pas encore)
create table if not exists public.user_data (
  user_id      uuid        references auth.users(id) on delete cascade primary key,
  username     text,
  stats        jsonb       not null default '{}',
  profile      jsonb,
  active_title text,
  updated_at   timestamptz not null default now()
);

-- Ajouter la colonne username si elle n'existe pas (migration)
alter table public.user_data
  add column if not exists username text;

-- RLS
alter table public.user_data enable row level security;

-- Supprimer les anciennes policies si elles existent, puis les recréer
drop policy if exists "Utilisateur gère ses propres données" on public.user_data;
drop policy if exists "Lecture publique pour le classement"  on public.user_data;

create policy "Utilisateur gère ses propres données"
  on public.user_data
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Lecture publique pour le classement"
  on public.user_data
  for select
  using (true);

-- Index (ignorés s'ils existent déjà grâce au IF NOT EXISTS)
create index if not exists user_data_ranked_xp_idx on public.user_data ((stats->>'rankedXP'));
create index if not exists user_data_username_idx  on public.user_data (username);

-- ⚠ Rappel : activer Anonymous Sign-ins dans
--   Authentication > Providers > Anonymous Sign-ins
