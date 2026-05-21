create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  starting_points int not null default 100 check (starting_points >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.markets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'その他',
  description text,
  deadline date not null,
  status text not null default 'open' check (status in ('open', 'closed', 'resolved')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.market_options (
  id uuid primary key default gen_random_uuid(),
  market_id uuid not null references public.markets(id) on delete cascade,
  label text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),
  market_id uuid not null references public.markets(id) on delete cascade,
  option_id uuid not null references public.market_options(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  user_name text not null,
  confidence int not null check (confidence between 1 and 100),
  stake int not null default 1 check (stake > 0),
  reason text,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists starting_points int not null default 100 check (starting_points >= 0);

alter table public.predictions
  add column if not exists stake int not null default 1 check (stake > 0);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  market_id uuid not null references public.markets(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  user_name text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.market_results (
  market_id uuid primary key references public.markets(id) on delete cascade,
  winning_option_id uuid not null references public.market_options(id) on delete restrict,
  resolved_by uuid references auth.users(id) on delete set null,
  note text,
  resolved_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.markets enable row level security;
alter table public.market_options enable row level security;
alter table public.predictions enable row level security;
alter table public.comments enable row level security;
alter table public.market_results enable row level security;

create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_self" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_self" on public.profiles for update using (auth.uid() = id);

create policy "markets_select_all" on public.markets for select using (true);
create policy "markets_insert_auth" on public.markets for insert with check (auth.uid() = created_by);
create policy "markets_update_creator" on public.markets for update using (auth.uid() = created_by);

create policy "options_select_all" on public.market_options for select using (true);
create policy "options_insert_auth" on public.market_options for insert with check (auth.uid() is not null);

create policy "predictions_select_all" on public.predictions for select using (true);
create policy "predictions_insert_auth" on public.predictions for insert with check (auth.uid() = user_id);

create policy "comments_select_all" on public.comments for select using (true);
create policy "comments_insert_auth" on public.comments for insert with check (auth.uid() = user_id);

create policy "results_select_all" on public.market_results for select using (true);
create policy "results_insert_auth" on public.market_results for insert with check (auth.uid() = resolved_by);

create or replace function public.mark_market_resolved()
returns trigger
language plpgsql
security definer
as $$
begin
  update public.markets set status = 'resolved' where id = new.market_id;
  return new;
end;
$$;

drop trigger if exists market_results_after_insert on public.market_results;
create trigger market_results_after_insert
after insert on public.market_results
for each row execute function public.mark_market_resolved();
