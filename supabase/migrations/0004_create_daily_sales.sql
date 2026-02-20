create table if not exists public.daily_sales (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  location_id uuid not null references public.locations(id) on delete cascade,
  square_order_id text not null,
  square_catalog_item_id text,
  item_name text,
  quantity_sold numeric not null,
  sold_at timestamptz not null,
  synced_at timestamptz not null default now(),
  constraint daily_sales_square_order_id_key unique (square_order_id)
);

create index if not exists idx_daily_sales_org_location_sold_at
on public.daily_sales (org_id, location_id, sold_at);

create index if not exists idx_daily_sales_square_catalog_item_id
on public.daily_sales (square_catalog_item_id);

create index if not exists idx_daily_sales_org_id on public.daily_sales (org_id);

alter table public.daily_sales enable row level security;

drop policy if exists daily_sales_member_select on public.daily_sales;
create policy daily_sales_member_select
on public.daily_sales
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists daily_sales_service_insert on public.daily_sales;
create policy daily_sales_service_insert
on public.daily_sales
for insert
to service_role
with check (true);
