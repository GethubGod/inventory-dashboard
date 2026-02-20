create table if not exists public.demand_forecasts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  location_id uuid not null references public.locations(id) on delete cascade,
  inventory_item_id uuid not null references public.inventory_items(id) on delete cascade,
  forecast_date date not null,
  forecast_quantity numeric not null,
  forecast_unit text not null,
  confidence text not null default 'none',
  reasoning_text text,
  data_points_used int,
  computed_at timestamptz not null default now(),
  constraint demand_forecasts_confidence_chk check (confidence in ('none', 'low', 'medium', 'high')),
  constraint demand_forecasts_org_location_item_date_key
    unique (org_id, location_id, inventory_item_id, forecast_date)
);

create index if not exists idx_demand_forecasts_org_id on public.demand_forecasts (org_id);
create index if not exists idx_demand_forecasts_location_item_date
on public.demand_forecasts (location_id, inventory_item_id, forecast_date);

alter table public.demand_forecasts enable row level security;

drop policy if exists demand_forecasts_member_select on public.demand_forecasts;
create policy demand_forecasts_member_select
on public.demand_forecasts
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists demand_forecasts_service_insert on public.demand_forecasts;
create policy demand_forecasts_service_insert
on public.demand_forecasts
for insert
to service_role
with check (true);

drop policy if exists demand_forecasts_service_update on public.demand_forecasts;
create policy demand_forecasts_service_update
on public.demand_forecasts
for update
to service_role
using (true)
with check (true);

drop policy if exists demand_forecasts_service_delete on public.demand_forecasts;
create policy demand_forecasts_service_delete
on public.demand_forecasts
for delete
to service_role
using (true);
