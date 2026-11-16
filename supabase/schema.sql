-- NIVORA ESSENTIALS order storage
-- Run this script in Supabase SQL Editor before enabling checkout.

create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  order_type text not null check (order_type in ('retail', 'wholesale')),
  status text not null default 'pending_confirmation',
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  business_name text,
  gstin text,
  delivery_address text not null,
  delivery_city text not null,
  delivery_state text not null,
  delivery_postal_code text not null,
  customer_notes text,
  items jsonb not null,
  subtotal_inr integer not null check (subtotal_inr >= 0),
  currency text not null default 'INR',
  payment_status text not null default 'unpaid',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

alter table public.orders enable row level security;

-- No public policies are created. Checkout writes use the server-only service role key.
-- Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
