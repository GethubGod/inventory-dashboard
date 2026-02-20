alter table public.locations enable row level security;
alter table public.inventory_items enable row level security;
alter table public.suppliers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.past_orders enable row level security;
alter table public.storage_areas enable row level security;
alter table public.area_items enable row level security;
alter table public.stock_updates enable row level security;
alter table public.profiles enable row level security;

drop policy if exists locations_org_scope_enforced on public.locations;
create policy locations_org_scope_enforced
on public.locations
as restrictive
for all
to public
using (auth.uid() is not null and public.is_org_member(org_id))
with check (auth.uid() is not null and public.is_org_member(org_id));

drop policy if exists inventory_items_org_scope_enforced on public.inventory_items;
create policy inventory_items_org_scope_enforced
on public.inventory_items
as restrictive
for all
to public
using (auth.uid() is not null and public.is_org_member(org_id))
with check (auth.uid() is not null and public.is_org_member(org_id));

drop policy if exists suppliers_org_scope_enforced on public.suppliers;
create policy suppliers_org_scope_enforced
on public.suppliers
as restrictive
for all
to public
using (auth.uid() is not null and public.is_org_member(org_id))
with check (auth.uid() is not null and public.is_org_member(org_id));

drop policy if exists orders_org_scope_enforced on public.orders;
create policy orders_org_scope_enforced
on public.orders
as restrictive
for all
to public
using (auth.uid() is not null and public.is_org_member(org_id))
with check (auth.uid() is not null and public.is_org_member(org_id));

drop policy if exists order_items_org_scope_enforced on public.order_items;
create policy order_items_org_scope_enforced
on public.order_items
as restrictive
for all
to public
using (auth.uid() is not null and public.is_org_member(org_id))
with check (auth.uid() is not null and public.is_org_member(org_id));

drop policy if exists past_orders_org_scope_enforced on public.past_orders;
create policy past_orders_org_scope_enforced
on public.past_orders
as restrictive
for all
to public
using (auth.uid() is not null and public.is_org_member(org_id))
with check (auth.uid() is not null and public.is_org_member(org_id));

drop policy if exists storage_areas_org_scope_enforced on public.storage_areas;
create policy storage_areas_org_scope_enforced
on public.storage_areas
as restrictive
for all
to public
using (auth.uid() is not null and public.is_org_member(org_id))
with check (auth.uid() is not null and public.is_org_member(org_id));

drop policy if exists area_items_org_scope_enforced on public.area_items;
create policy area_items_org_scope_enforced
on public.area_items
as restrictive
for all
to public
using (auth.uid() is not null and public.is_org_member(org_id))
with check (auth.uid() is not null and public.is_org_member(org_id));

drop policy if exists stock_updates_org_scope_enforced on public.stock_updates;
create policy stock_updates_org_scope_enforced
on public.stock_updates
as restrictive
for all
to public
using (auth.uid() is not null and public.is_org_member(org_id))
with check (auth.uid() is not null and public.is_org_member(org_id));

drop policy if exists profiles_org_scope_enforced on public.profiles;
create policy profiles_org_scope_enforced
on public.profiles
as restrictive
for all
to public
using (auth.uid() is not null and public.is_org_member(org_id))
with check (auth.uid() is not null and public.is_org_member(org_id));
