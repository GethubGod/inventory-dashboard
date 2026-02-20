create table if not exists public.square_connections (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  access_token_encrypted text not null,
  refresh_token_encrypted text not null,
  merchant_id text not null,
  square_location_ids text[] not null default '{}'::text[],
  token_expires_at timestamptz,
  last_synced_at timestamptz,
  sync_status text not null default 'active',
  sync_error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint square_connections_sync_status_chk check (sync_status in ('active', 'paused', 'error')),
  constraint square_connections_org_merchant_key unique (org_id, merchant_id)
);

create index if not exists idx_square_connections_org_id on public.square_connections (org_id);
create index if not exists idx_square_connections_sync_status on public.square_connections (sync_status);
create index if not exists idx_square_connections_last_synced_at on public.square_connections (last_synced_at);

alter table public.square_connections enable row level security;

drop trigger if exists set_square_connections_updated_at on public.square_connections;
create trigger set_square_connections_updated_at
before update on public.square_connections
for each row
execute function public.set_updated_at();

drop policy if exists square_connections_admin_select on public.square_connections;
create policy square_connections_admin_select
on public.square_connections
for select
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin']::text[]));

drop policy if exists square_connections_admin_insert on public.square_connections;
create policy square_connections_admin_insert
on public.square_connections
for insert
to authenticated
with check (public.has_org_role(org_id, array['owner', 'admin']::text[]));

drop policy if exists square_connections_admin_update on public.square_connections;
create policy square_connections_admin_update
on public.square_connections
for update
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin']::text[]))
with check (public.has_org_role(org_id, array['owner', 'admin']::text[]));

drop policy if exists square_connections_admin_delete on public.square_connections;
create policy square_connections_admin_delete
on public.square_connections
for delete
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin']::text[]));
