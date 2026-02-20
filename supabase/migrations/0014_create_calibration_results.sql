create table if not exists public.calibration_results (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  location_id uuid not null references public.locations(id) on delete cascade,
  inventory_item_id uuid not null references public.inventory_items(id) on delete cascade,
  calibration_date date,
  counted_start numeric,
  counted_end numeric,
  calculated_usage numeric,
  actual_usage numeric,
  discrepancy_pct numeric,
  adjustment_factor numeric,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_calibration_results_org_location_item_date
on public.calibration_results (org_id, location_id, inventory_item_id, calibration_date);

create index if not exists idx_calibration_results_inventory_item_id
on public.calibration_results (inventory_item_id);

alter table public.calibration_results enable row level security;

drop policy if exists calibration_results_member_select on public.calibration_results;
create policy calibration_results_member_select
on public.calibration_results
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists calibration_results_manager_insert on public.calibration_results;
create policy calibration_results_manager_insert
on public.calibration_results
for insert
to authenticated
with check (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));

drop policy if exists calibration_results_manager_update on public.calibration_results;
create policy calibration_results_manager_update
on public.calibration_results
for update
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]))
with check (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));

drop policy if exists calibration_results_manager_delete on public.calibration_results;
create policy calibration_results_manager_delete
on public.calibration_results
for delete
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));
