create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  square_catalog_item_id text not null,
  square_item_name text,
  inventory_item_id uuid not null references public.inventory_items(id) on delete cascade,
  quantity_per_sale numeric not null,
  unit text not null,
  adjustment_factor numeric not null default 1.0,
  is_auto_suggested boolean not null default false,
  confirmed_by uuid references public.users(id) on delete set null,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint recipes_quantity_per_sale_chk check (quantity_per_sale > 0),
  constraint recipes_adjustment_factor_chk check (adjustment_factor > 0),
  constraint recipes_org_square_inventory_key unique (org_id, square_catalog_item_id, inventory_item_id)
);

create index if not exists idx_recipes_org_id on public.recipes (org_id);
create index if not exists idx_recipes_inventory_item_id on public.recipes (inventory_item_id);
create index if not exists idx_recipes_square_catalog_item_id on public.recipes (square_catalog_item_id);

alter table public.recipes enable row level security;

drop trigger if exists set_recipes_updated_at on public.recipes;
create trigger set_recipes_updated_at
before update on public.recipes
for each row
execute function public.set_updated_at();

drop policy if exists recipes_member_select on public.recipes;
create policy recipes_member_select
on public.recipes
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists recipes_manager_insert on public.recipes;
create policy recipes_manager_insert
on public.recipes
for insert
to authenticated
with check (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));

drop policy if exists recipes_manager_update on public.recipes;
create policy recipes_manager_update
on public.recipes
for update
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]))
with check (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));

drop policy if exists recipes_manager_delete on public.recipes;
create policy recipes_manager_delete
on public.recipes
for delete
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));
