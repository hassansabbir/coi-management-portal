-- ============================================================
-- COI Management Platform — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. CLIENTS
-- ============================================================
create table if not exists public.clients (
  id               uuid primary key default gen_random_uuid(),
  contact_name     text not null,
  business_name    text not null,
  contact_email    text not null unique,
  phone            text,
  address          text,
  avatar_initials  text,
  created_at       timestamptz not null default now()
);

-- ============================================================
-- 2. USER PROFILES (linked to Supabase Auth users)
-- ============================================================
create table if not exists public.user_profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  role             text not null default 'client' check (role in ('admin', 'client')),
  business_name    text,
  avatar_initials  text,
  client_id        uuid references public.clients(id) on delete set null
);

-- ============================================================
-- 3. CERTIFICATES
-- ============================================================
create table if not exists public.certificates (
  id                          uuid primary key default gen_random_uuid(),
  client_id                   uuid not null references public.clients(id) on delete cascade,
  certificate_number          text not null unique,
  policy_type                 text not null,
  policy_number               text not null,
  insured_name                text not null,
  effective_date              date,
  expiration_date             date,
  general_aggregate_limit     text,
  each_occurrence_limit       text,
  file_size                   text,

  -- Template: admin-uploaded PDF stored in 'coi-templates' bucket
  template_storage_path       text,

  -- Pre-filled by admin; client can edit the whole box
  description_of_operations   text default '',

  -- Client-editable fields (stamped onto PDF at generation time)
  certificate_holder_name     text not null default '',
  certificate_holder_address  text not null default '',
  certificate_date            date,
  additional_insured          boolean not null default false,

  status                      text not null default 'active' check (status in ('active', 'inactive')),
  last_updated                timestamptz not null default now(),
  created_at                  timestamptz not null default now()
);

-- ============================================================
-- 4. COI SUBMISSIONS (generated & sent PDFs)
-- ============================================================
create table if not exists public.coi_submissions (
  id                      uuid primary key default gen_random_uuid(),
  certificate_id          uuid not null references public.certificates(id) on delete cascade,
  generated_storage_path  text,        -- path in 'coi-generated' bucket
  recipient_email         text,
  status                  text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  sent_at                 timestamptz,
  created_at              timestamptz not null default now()
);

-- ============================================================
-- 5. ACTIVITIES (audit log)
-- ============================================================
create table if not exists public.activities (
  id              uuid primary key default gen_random_uuid(),
  certificate_id  uuid references public.certificates(id) on delete set null,
  client_name     text not null,
  title           text not null,
  action          text not null,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

alter table public.clients           enable row level security;
alter table public.user_profiles     enable row level security;
alter table public.certificates      enable row level security;
alter table public.coi_submissions   enable row level security;
alter table public.activities        enable row level security;

-- Helper function: get the current user's role
create or replace function public.get_my_role()
returns text language sql security definer stable as $$
  select role from public.user_profiles where id = auth.uid();
$$;

-- Helper function: get the current user's client_id
create or replace function public.get_my_client_id()
returns uuid language sql security definer stable as $$
  select client_id from public.user_profiles where id = auth.uid();
$$;

-- CLIENTS
create policy "Admins can do anything on clients"
  on public.clients for all
  using (public.get_my_role() = 'admin');

create policy "Clients can read their own client row"
  on public.clients for select
  using (id = public.get_my_client_id());

-- USER PROFILES
create policy "Users can read their own profile"
  on public.user_profiles for select
  using (id = auth.uid());

create policy "Admins can read all profiles"
  on public.user_profiles for select
  using (public.get_my_role() = 'admin');

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (id = auth.uid());

-- CERTIFICATES
create policy "Admins can do anything on certificates"
  on public.certificates for all
  using (public.get_my_role() = 'admin');

create policy "Clients can read their own certificates"
  on public.certificates for select
  using (client_id = public.get_my_client_id());

create policy "Clients can update their own certificates (editable fields only)"
  on public.certificates for update
  using (client_id = public.get_my_client_id())
  with check (client_id = public.get_my_client_id());

-- COI SUBMISSIONS
create policy "Admins can do anything on coi_submissions"
  on public.coi_submissions for all
  using (public.get_my_role() = 'admin');

create policy "Clients can read their own submissions"
  on public.coi_submissions for select
  using (
    certificate_id in (
      select id from public.certificates where client_id = public.get_my_client_id()
    )
  );

-- ACTIVITIES
create policy "Admins can do anything on activities"
  on public.activities for all
  using (public.get_my_role() = 'admin');

create policy "Clients can read their own activities"
  on public.activities for select
  using (
    certificate_id in (
      select id from public.certificates where client_id = public.get_my_client_id()
    )
  );

-- ============================================================
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- Trigger: whenever a new user signs up via Supabase Auth,
-- automatically create a user_profiles row with role = 'client'
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_profiles (id, role)
  values (new.id, 'client')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- STORAGE BUCKETS
-- Run these separately in the Supabase Dashboard → Storage
-- OR uncomment below if using the SQL API approach:
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('coi-templates', 'coi-templates', false) on conflict do nothing;
-- insert into storage.buckets (id, name, public) values ('coi-generated', 'coi-generated', false) on conflict do nothing;

-- Storage RLS: only service role (admin) can access both buckets
-- This is enforced by using the SUPABASE_SERVICE_ROLE_KEY in API routes.

-- ============================================================
-- 6. FAQS (Help & Support)
-- ============================================================
create table if not exists public.faqs (
  id              uuid primary key default gen_random_uuid(),
  question        text not null,
  answer          text not null,
  created_at      timestamptz not null default now()
);

alter table public.faqs enable row level security;

create policy "Admins can do anything on faqs"
  on public.faqs for all
  using (public.get_my_role() = 'admin');

create policy "Clients can read faqs"
  on public.faqs for select
  using (true);
