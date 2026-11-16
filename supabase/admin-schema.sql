-- NIVORA ESSENTIALS admin catalogue
-- Run after schema.sql in Supabase SQL Editor.
create table if not exists public.products (
  id text primary key,
  name text not null,
  audience text not null check (audience in ('Men', 'Women', 'Boy', 'Girl')),
  type text not null,
  range text not null check (range in ('Essential', 'Everyday', 'Premium', 'Luxury')),
  price integer not null check (price > 0),\n  wholesale_price integer check (wholesale_price > 0 and wholesale_price <= price),
  sizes text[] not null default '{}',
  tone text not null default 'Classic',
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_active_idx on public.products (active);
alter table public.products enable row level security;
-- No public write policies. Admin API uses server-side service role after checking the signed-in user's email against ADMIN_EMAILS.

alter table public.products add column if not exists wholesale_price integer;
