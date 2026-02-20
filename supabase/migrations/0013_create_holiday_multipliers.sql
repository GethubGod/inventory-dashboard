create table if not exists public.holiday_multipliers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null,
  category text,
  multiplier numeric not null default 1.0,
  notes text,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint holiday_multipliers_date_range_chk check (end_date >= start_date)
);

create index if not exists idx_holiday_multipliers_org_id on public.holiday_multipliers (org_id);
create index if not exists idx_holiday_multipliers_date_range on public.holiday_multipliers (start_date, end_date);
create index if not exists idx_holiday_multipliers_category on public.holiday_multipliers (category);

alter table public.holiday_multipliers enable row level security;

drop policy if exists holiday_multipliers_member_select on public.holiday_multipliers;
create policy holiday_multipliers_member_select
on public.holiday_multipliers
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists holiday_multipliers_manager_insert on public.holiday_multipliers;
create policy holiday_multipliers_manager_insert
on public.holiday_multipliers
for insert
to authenticated
with check (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));

drop policy if exists holiday_multipliers_manager_update on public.holiday_multipliers;
create policy holiday_multipliers_manager_update
on public.holiday_multipliers
for update
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]))
with check (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));

drop policy if exists holiday_multipliers_manager_delete on public.holiday_multipliers;
create policy holiday_multipliers_manager_delete
on public.holiday_multipliers
for delete
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));
