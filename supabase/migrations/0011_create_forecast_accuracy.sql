create table if not exists public.forecast_accuracy (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  location_id uuid not null references public.locations(id) on delete cascade,
  inventory_item_id uuid not null references public.inventory_items(id) on delete cascade,
  forecast_date date,
  predicted_quantity numeric,
  actual_quantity numeric,
  error_pct numeric,
  manager_adjusted boolean not null default false,
  manager_adjusted_to numeric,
  suggestion_accepted boolean,
  created_at timestamptz not null default now()
);

create index if not exists idx_forecast_accuracy_org_inventory_forecast_date
on public.forecast_accuracy (org_id, inventory_item_id, forecast_date);

create index if not exists idx_forecast_accuracy_location_id
on public.forecast_accuracy (location_id);

alter table public.forecast_accuracy enable row level security;

drop policy if exists forecast_accuracy_member_select on public.forecast_accuracy;
create policy forecast_accuracy_member_select
on public.forecast_accuracy
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists forecast_accuracy_manager_insert on public.forecast_accuracy;
create policy forecast_accuracy_manager_insert
on public.forecast_accuracy
for insert
to authenticated
with check (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));

drop policy if exists forecast_accuracy_manager_update on public.forecast_accuracy;
create policy forecast_accuracy_manager_update
on public.forecast_accuracy
for update
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]))
with check (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));

drop policy if exists forecast_accuracy_service_insert on public.forecast_accuracy;
create policy forecast_accuracy_service_insert
on public.forecast_accuracy
for insert
to service_role
with check (true);

drop policy if exists forecast_accuracy_service_update on public.forecast_accuracy;
create policy forecast_accuracy_service_update
on public.forecast_accuracy
for update
to service_role
using (true)
with check (true);
