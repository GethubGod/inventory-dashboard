create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  address text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.locations add column if not exists org_id uuid;
alter table public.locations add column if not exists name text;
alter table public.locations add column if not exists address text;
alter table public.locations add column if not exists phone text;
alter table public.locations add column if not exists created_at timestamptz not null default now();
alter table public.locations add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_locations_org_id_created_at on public.locations (org_id, created_at);

drop trigger if exists set_locations_updated_at on public.locations;
create trigger set_locations_updated_at
before update on public.locations
for each row
execute function public.set_updated_at();

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  email text not null,
  role text not null,
  status text not null default 'pending',
  invited_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_roles_role_chk check (role in ('owner', 'manager', 'staff')),
  constraint user_roles_status_chk check (status in ('pending', 'accepted', 'revoked')),
  constraint user_roles_org_email_key unique (org_id, email)
);

create index if not exists idx_user_roles_org_id on public.user_roles (org_id);
create index if not exists idx_user_roles_email on public.user_roles (email);

alter table public.user_roles enable row level security;

drop trigger if exists set_user_roles_updated_at on public.user_roles;
create trigger set_user_roles_updated_at
before update on public.user_roles
for each row
execute function public.set_updated_at();

drop policy if exists user_roles_select_members on public.user_roles;
create policy user_roles_select_members
on public.user_roles
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists user_roles_insert_admin on public.user_roles;
create policy user_roles_insert_admin
on public.user_roles
for insert
to authenticated
with check (
  public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[])
  and invited_by = auth.uid()
);

drop policy if exists user_roles_update_admin on public.user_roles;
create policy user_roles_update_admin
on public.user_roles
for update
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]))
with check (public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[]));

drop policy if exists user_roles_delete_admin on public.user_roles;
create policy user_roles_delete_admin
on public.user_roles
for delete
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin']::text[]));

create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.organizations(id) on delete cascade,
  user_id uuid not null,
  provider text not null,
  status text not null default 'connected',
  oauth_state text not null,
  merchant_id text,
  access_token text not null,
  refresh_token text,
  token_expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint integrations_provider_chk check (provider in ('square')),
  constraint integrations_status_chk check (status in ('connected', 'paused', 'error', 'revoked')),
  constraint integrations_oauth_state_key unique (oauth_state)
);

create index if not exists idx_integrations_org_id_provider on public.integrations (org_id, provider);
create index if not exists idx_integrations_user_id_provider on public.integrations (user_id, provider);

alter table public.integrations enable row level security;

drop trigger if exists set_integrations_updated_at on public.integrations;
create trigger set_integrations_updated_at
before update on public.integrations
for each row
execute function public.set_updated_at();

drop policy if exists integrations_select_scope on public.integrations;
create policy integrations_select_scope
on public.integrations
for select
to authenticated
using (
  user_id = auth.uid()
  or (
    org_id is not null
    and public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[])
  )
);

drop policy if exists integrations_insert_scope on public.integrations;
create policy integrations_insert_scope
on public.integrations
for insert
to authenticated
with check (
  user_id = auth.uid()
  and (
    org_id is null
    or public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[])
  )
);

drop policy if exists integrations_update_scope on public.integrations;
create policy integrations_update_scope
on public.integrations
for update
to authenticated
using (
  user_id = auth.uid()
  or (
    org_id is not null
    and public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[])
  )
)
with check (
  user_id = auth.uid()
  or (
    org_id is not null
    and public.has_org_role(org_id, array['owner', 'admin', 'manager']::text[])
  )
);

drop policy if exists integrations_delete_scope on public.integrations;
create policy integrations_delete_scope
on public.integrations
for delete
to authenticated
using (
  user_id = auth.uid()
  or (
    org_id is not null
    and public.has_org_role(org_id, array['owner', 'admin']::text[])
  )
);
