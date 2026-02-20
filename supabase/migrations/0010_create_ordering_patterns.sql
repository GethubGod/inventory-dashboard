create table if not exists public.ordering_patterns (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  location_id uuid not null references public.locations(id) on delete cascade,
  inventory_item_id uuid not null references public.inventory_items(id) on delete cascade,
  day_of_week int not null,
  weighted_avg_quantity numeric,
  seasonality_index numeric not null default 1.0,
  trend_pct numeric not null default 0.0,
  variance numeric,
  coefficient_of_variation numeric,
  data_maturity text not null default 'none',
  last_computed_at timestamptz,
  constraint ordering_patterns_day_of_week_chk check (day_of_week between 0 and 6),
  constraint ordering_patterns_data_maturity_chk
    check (data_maturity in ('none', 'low', 'medium', 'high')),
  constraint ordering_patterns_org_location_item_dow_key
    unique (org_id, location_id, inventory_item_id, day_of_week)
);

create index if not exists idx_ordering_patterns_org_id on public.ordering_patterns (org_id);
create index if not exists idx_ordering_patterns_location_item on public.ordering_patterns (location_id, inventory_item_id);

alter table public.ordering_patterns enable row level security;

drop policy if exists ordering_patterns_member_select on public.ordering_patterns;
create policy ordering_patterns_member_select
on public.ordering_patterns
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists ordering_patterns_service_insert on public.ordering_patterns;
create policy ordering_patterns_service_insert
on public.ordering_patterns
for insert
to service_role
with check (true);

drop policy if exists ordering_patterns_service_update on public.ordering_patterns;
create policy ordering_patterns_service_update
on public.ordering_patterns
for update
to service_role
using (true)
with check (true);

drop policy if exists ordering_patterns_service_delete on public.ordering_patterns;
create policy ordering_patterns_service_delete
on public.ordering_patterns
for delete
to service_role
using (true);
