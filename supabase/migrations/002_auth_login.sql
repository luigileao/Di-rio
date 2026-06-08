-- ============================================================
-- Meu Diário v6 — Login com conta (Supabase Auth) + isolamento por usuário
-- SQL Editor → New query → cole tudo → Run
-- Depois NÃO é mais necessário a Edge Function para sincronizar.
-- ============================================================

-- 1) Vincula cada registro ao usuário dono (preenchido automaticamente no insert)
alter table diario_recs add column if not exists user_id uuid references auth.users(id) default auth.uid();

-- 2) Remove a política antiga (que deixava qualquer um acessar tudo)
drop policy if exists "anon_all" on diario_recs;

-- 3) Políticas por usuário: cada conta só enxerga e altera os PRÓPRIOS dados
drop policy if exists "own_select" on diario_recs;
drop policy if exists "own_insert" on diario_recs;
drop policy if exists "own_update" on diario_recs;
drop policy if exists "own_delete" on diario_recs;

create policy "own_select" on diario_recs for select to authenticated using (auth.uid() = user_id);
create policy "own_insert" on diario_recs for insert to authenticated with check (auth.uid() = user_id);
create policy "own_update" on diario_recs for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own_delete" on diario_recs for delete to authenticated using (auth.uid() = user_id);

-- Pronto. A sincronização agora é direta (PostgREST) e isolada por conta.
-- Dica: em Authentication → Providers → Email, você pode DESLIGAR "Confirm email"
-- para entrar na hora (sem precisar clicar em link no e-mail). É opcional.
