-- Run this entire file in Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 60),
  question text not null check (char_length(question) between 5 and 1000),
  answer text,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.questions enable row level security;

-- Visitors can submit questions. They cannot choose an answer or publish status.
drop policy if exists "Anyone can submit questions" on public.questions;
create policy "Anyone can submit questions"
on public.questions for insert to anon, authenticated
with check (
  char_length(trim(name)) between 2 and 60
  and char_length(trim(question)) between 5 and 1000
  and answer is null
  and is_published = false
);

-- Visitors can only read questions Roman has answered and published.
drop policy if exists "Public can read published answers" on public.questions;
create policy "Public can read published answers"
on public.questions for select to anon, authenticated
using (is_published = true and answer is not null);

-- Admin access: create ONE admin account in Supabase Authentication.
-- Then disable public sign-ups in Authentication > Settings.
-- Any authenticated account can manage rows, so do not enable public sign-ups.
drop policy if exists "Admin can read all questions" on public.questions;
create policy "Admin can read all questions"
on public.questions for select to authenticated
using (auth.role() = 'authenticated');

drop policy if exists "Admin can update questions" on public.questions;
create policy "Admin can update questions"
on public.questions for update to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Admin can delete questions" on public.questions;
create policy "Admin can delete questions"
on public.questions for delete to authenticated
using (auth.role() = 'authenticated');

grant usage on schema public to anon, authenticated;
grant insert on public.questions to anon, authenticated;
grant select on public.questions to anon, authenticated;
grant update, delete on public.questions to authenticated;