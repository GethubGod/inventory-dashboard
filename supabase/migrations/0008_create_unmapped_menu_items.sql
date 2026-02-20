create table if not exists public.unmapped_menu_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  square_catalog_item_id text,
  square_item_name text,
  detected_at timestamptz not null default now(),
  status text not null default 'needs_mapping',
  auto_suggestions jsonb not null default '[]'::jsonb,
  resolved_by uuid references public.users(id) on delete set null,
  resolved_at timestamptz,
  constraint unmapped_menu_items_status_chk
    check (status in ('needs_mapping', 'mapped', 'ignored'))
);

create index if not exists idx_unmapped_menu_items_org_id on public.unmapped_menu_items (org_id);
create index if not exists idx_unmapped_menu_items_status on public.unmapped_menu_items (status);
create index if not exists idx_unmapped_menu_items_square_catalog_item_id on public.unmapped_menu_items (square_catalog_item_id);

alter table public.unmapped_menu_items enable row level security;

drop policy if exists unmapped_menu_items_member_select on public.unmapped_menu_items;
create policy unmapped_menu_items_member_select
on public.unmapped_menu_items
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists unmapped_menu_items_manager_insert on public.unmapped_menu_items;
create policy unmapped_menu_items_manager_insert
on public.unmapped_menu_items
for insert
to authenticated
with check (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));

drop policy if exists unmapped_menu_items_manager_update on public.unmapped_menu_items;
create policy unmapped_menu_items_manager_update
on public.unmapped_menu_items
for update
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]))
with check (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));

drop policy if exists unmapped_menu_items_manager_delete on public.unmapped_menu_items;
create policy unmapped_menu_items_manager_delete
on public.unmapped_menu_items
for delete
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));
