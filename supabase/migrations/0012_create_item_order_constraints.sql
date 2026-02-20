create table if not exists public.item_order_constraints (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  inventory_item_id uuid not null references public.inventory_items(id) on delete cascade,
  min_order_qty numeric,
  max_order_qty numeric,
  max_change_pct numeric not null default 50,
  preferred_supplier_id uuid references public.suppliers(id) on delete set null,
  delivery_days int[],
  lead_time_days int not null default 1,
  updated_by uuid references public.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint item_order_constraints_qty_range_chk
    check (
      min_order_qty is null
      or max_order_qty is null
      or min_order_qty <= max_order_qty
    ),
  constraint item_order_constraints_delivery_days_chk
    check (delivery_days is null or delivery_days <@ array[0, 1, 2, 3, 4, 5, 6]::int[]),
  constraint item_order_constraints_lead_time_days_chk check (lead_time_days >= 0),
  constraint item_order_constraints_org_inventory_key unique (org_id, inventory_item_id)
);

create index if not exists idx_item_order_constraints_org_id on public.item_order_constraints (org_id);
create index if not exists idx_item_order_constraints_inventory_item_id on public.item_order_constraints (inventory_item_id);
create index if not exists idx_item_order_constraints_preferred_supplier_id on public.item_order_constraints (preferred_supplier_id);

alter table public.item_order_constraints enable row level security;

drop trigger if exists set_item_order_constraints_updated_at on public.item_order_constraints;
create trigger set_item_order_constraints_updated_at
before update on public.item_order_constraints
for each row
execute function public.set_updated_at();

drop policy if exists item_order_constraints_member_select on public.item_order_constraints;
create policy item_order_constraints_member_select
on public.item_order_constraints
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists item_order_constraints_manager_insert on public.item_order_constraints;
create policy item_order_constraints_manager_insert
on public.item_order_constraints
for insert
to authenticated
with check (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));

drop policy if exists item_order_constraints_manager_update on public.item_order_constraints;
create policy item_order_constraints_manager_update
on public.item_order_constraints
for update
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]))
with check (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));

drop policy if exists item_order_constraints_manager_delete on public.item_order_constraints;
create policy item_order_constraints_manager_delete
on public.item_order_constraints
for delete
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));
