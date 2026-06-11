-- AI Recruitment Platform (TalentAI) - Schema & Database Initialization
-- This script sets up the profiles, vacancies, candidates, and AI logs tables,
-- along with triggers for user profile synchronisation and Row Level Security (RLS).

-- Enable UUID generation extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text not null check (role in ('recruiter', 'hiring_manager', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by authenticated users."
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update their own profile."
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Trigger to automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'recruiter')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. VACANCIES (JOB POSITIONS) TABLE
create table public.vacancies (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  department text,
  status text not null default 'active' check (status in ('active', 'closed', 'draft')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Vacancies
alter table public.vacancies enable row level security;

-- Vacancies Policies
create policy "Vacancies are viewable by all authenticated users."
  on public.vacancies for select
  to authenticated
  using (true);

create policy "Recruiters and admins can insert vacancies."
  on public.vacancies for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('recruiter', 'admin')
    )
  );

create policy "Recruiters and admins can update vacancies."
  on public.vacancies for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('recruiter', 'admin')
    )
  );


-- 3. CANDIDATES TABLE
create table public.candidates (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  resume_url text,
  status text not null default 'new' check (status in ('new', 'screening', 'interview', 'offered', 'rejected')),
  vacancy_id uuid references public.vacancies(id) on delete cascade not null,
  ai_summary text,
  ai_score integer check (ai_score >= 0 and ai_score <= 100),
  ai_insights jsonb, -- structured data for AI analysis (gaps, strengths, human comments)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Candidates
alter table public.candidates enable row level security;

-- Candidates Policies
create policy "Candidates are viewable by all authenticated users."
  on public.candidates for select
  to authenticated
  using (true);

create policy "Recruiters and admins can insert candidates."
  on public.candidates for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('recruiter', 'admin')
    )
  );

create policy "All authenticated users can update candidate status and information."
  on public.candidates for update
  to authenticated
  using (true);


-- 4. AI USAGE LOGS TABLE
create table public.ai_usage_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  prompt_tokens integer not null default 0,
  completion_tokens integer not null default 0,
  cost_usd numeric(10, 6) not null default 0.000000,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for AI Usage Logs
alter table public.ai_usage_logs enable row level security;

-- AI Usage Logs Policies
create policy "AI Usage Logs are viewable by admins and recruiters."
  on public.ai_usage_logs for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.role in ('recruiter', 'admin')
    )
  );

create policy "System can insert AI logs."
  on public.ai_usage_logs for insert
  to authenticated
  with check (true);
