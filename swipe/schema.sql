-- Ball-drop Swipe — swipe_commands table + anon RLS
-- Matches the live Supabase project (khyejqvutrjwxljuhmot).
-- Safe to re-run: create-if-not-exists / create-policy-if-missing.

create table if not exists public.swipe_commands (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  direction text not null
    check (direction = any (array['up'::text, 'down'::text, 'left'::text, 'right'::text])),
  command text not null,
  transcript text
);

alter table public.swipe_commands enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'swipe_commands'
      and policyname = 'anon_insert_swipe_commands'
  ) then
    create policy anon_insert_swipe_commands
      on public.swipe_commands
      for insert
      to anon
      with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'swipe_commands'
      and policyname = 'anon_select_swipe_commands'
  ) then
    create policy anon_select_swipe_commands
      on public.swipe_commands
      for select
      to anon
      using (true);
  end if;
end $$;

grant select, insert on public.swipe_commands to anon;
