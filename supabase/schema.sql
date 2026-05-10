-- travel-guide のスキーマ定義
-- 新規 Supabase プロジェクトを作成したら、SQL Editor にこのファイルの内容を貼り付けて実行する

-- ============================================================
-- Tables
-- ============================================================

-- 旅行プラン
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Your Trip',
  created_at timestamptz not null default now()
);

-- スポット
create table if not exists public.locations (
  id bigserial primary key,
  trip_id uuid not null references public.trips(id) on delete cascade,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  category text,
  description text default '',
  place_id text,
  photo_reference text,
  created_at timestamptz not null default now()
);

create index if not exists locations_trip_id_idx on public.locations(trip_id);

-- お気に入り（trip × location の組み合わせ）
create table if not exists public.favorites (
  trip_id uuid not null references public.trips(id) on delete cascade,
  location_id bigint not null references public.locations(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (trip_id, location_id)
);

-- ============================================================
-- Row Level Security
-- このアプリは認証なし (anon キーのみ) で利用するため、
-- anon ロールに全操作を許可する。
-- ============================================================

alter table public.trips enable row level security;
alter table public.locations enable row level security;
alter table public.favorites enable row level security;

create policy "trips: anon all"
  on public.trips for all
  to anon
  using (true)
  with check (true);

create policy "locations: anon all"
  on public.locations for all
  to anon
  using (true)
  with check (true);

create policy "favorites: anon all"
  on public.favorites for all
  to anon
  using (true)
  with check (true);
