-- ============================================================
-- Meu Diário v2 — schema inicial
-- SQL Editor → New query → cole tudo → Run
-- ============================================================
create table if not exists diario_recs (
  id          text primary key,
  owner       text not null,
  deleted     boolean default false,
  data        jsonb not null default '{}',
  updated_at  timestamptz not null default now(),
  created_at  timestamptz default now()
);
create index if not exists idx_diario_updated on diario_recs(updated_at);
create index if not exists idx_diario_owner   on diario_recs(owner);

alter table diario_recs enable row level security;
drop policy if exists "anon_all" on diario_recs;
create policy "anon_all" on diario_recs for all to anon using (true) with check (true);

-- Storage: o bucket "diario-media" é criado automaticamente pela Edge Function
-- na primeira sincronização de mídia. Se preferir criar manualmente:
--   Dashboard → Storage → New bucket → nome: diario-media → marque "Public bucket".
