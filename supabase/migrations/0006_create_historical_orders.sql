create table if not exists public.historical_orders (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  location_id uuid not null references public.locations(id) on delete cascade,
  order_date date not null,
  inventory_item_id uuid not null references public.inventory_items(id) on delete cascade,
  quantity numeric not null,
  unit_type text not null,
  source text not null,
  raw_item_name text,
  import_batch_id uuid,
  cleaned_by_ai boolean not null default false,
  created_at timestamptz not null default now(),
  constraint historical_orders_source_chk
    check (source in ('csv_upload', 'square_import', 'manual_entry', 'app_order'))
);

create index if not exists idx_historical_orders_org_inventory_order_date
on public.historical_orders (org_id, inventory_item_id, order_date);

create index if not exists idx_historical_orders_org_location_order_date
on public.historical_orders (org_id, location_id, order_date);

create index if not exists idx_historical_orders_import_batch_id
on public.historical_orders (import_batch_id);

alter table public.historical_orders enable row level security;

drop policy if exists historical_orders_member_select on public.historical_orders;
create policy historical_orders_member_select
on public.historical_orders
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists historical_orders_manager_insert on public.historical_orders;
create policy historical_orders_manager_insert
on public.historical_orders
for insert
to authenticated
with check (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));

drop policy if exists historical_orders_manager_update on public.historical_orders;
create policy historical_orders_manager_update
on public.historical_orders
for update
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]))
with check (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));

drop policy if exists historical_orders_manager_delete on public.historical_orders;
create policy historical_orders_manager_delete
on public.historical_orders
for delete
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));
