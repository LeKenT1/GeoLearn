-- ─── GeoLearn — Schéma Supabase ──────────────────────────────────────────────
-- À coller dans l'éditeur SQL de votre projet Supabase :
-- https://supabase.com/dashboard/project/VOTRE_ID/sql/new
-- ─────────────────────────────────────────────────────────────────────────────

-- Table principale : une ligne par utilisateur
create table public.user_data (
  user_id     uuid        references auth.users(id) on delete cascade primary key,
  stats       jsonb       not null default '{}',
  profile     jsonb,
  active_title text,
  updated_at  timestamptz not null default now()
);

-- Activer la sécurité au niveau des lignes (RLS)
alter table public.user_data enable row level security;

-- Politique : chaque utilisateur ne peut lire/écrire que sa propre ligne
create policy "Utilisateur gère ses propres données"
  on public.user_data
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index pour accélèrer les lookups (optionnel mais bonne pratique)
create index on public.user_data (user_id);
