create table if not exists public.org_memberships (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null,
  invited_by uuid references public.users(id) on delete set null,
  invited_at timestamptz not null default now(),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint org_memberships_role_chk check (role in ('owner', 'admin', 'manager', 'employee')),
  constraint org_memberships_org_user_key unique (org_id, user_id)
);

create index if not exists idx_org_memberships_org_id on public.org_memberships (org_id);
create index if not exists idx_org_memberships_user_id on public.org_memberships (user_id);
create index if not exists idx_org_memberships_org_role on public.org_memberships (org_id, role);

create or replace function public.is_org_member(target_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.org_memberships m
    where m.org_id = target_org_id
      and m.user_id = auth.uid()
      and m.accepted_at is not null
  );
$$;

create or replace function public.has_org_role(target_org_id uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.org_memberships m
    where m.org_id = target_org_id
      and m.user_id = auth.uid()
      and m.accepted_at is not null
      and m.role = any(allowed_roles)
  );
$$;

create or replace function public.org_has_members(target_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.org_memberships m
    where m.org_id = target_org_id
  );
$$;

alter table public.org_memberships enable row level security;

drop trigger if exists set_org_memberships_updated_at on public.org_memberships;
create trigger set_org_memberships_updated_at
before update on public.org_memberships
for each row
execute function public.set_updated_at();

alter table public.organizations enable row level security;

drop policy if exists organizations_select_own_org on public.organizations;
create policy organizations_select_own_org
on public.organizations
for select
to authenticated
using (public.is_org_member(id));

drop policy if exists organizations_insert_authenticated on public.organizations;
create policy organizations_insert_authenticated
on public.organizations
for insert
to authenticated
with check (auth.uid() is not null);

drop policy if exists organizations_update_admin on public.organizations;
create policy organizations_update_admin
on public.organizations
for update
to authenticated
using (public.has_org_role(id, array['owner', 'admin']::text[]))
with check (public.has_org_role(id, array['owner', 'admin']::text[]));

drop policy if exists organizations_delete_owner on public.organizations;
create policy organizations_delete_owner
on public.organizations
for delete
to authenticated
using (public.has_org_role(id, array['owner']::text[]));

drop policy if exists org_memberships_select_org_members on public.org_memberships;
create policy org_memberships_select_org_members
on public.org_memberships
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists org_memberships_insert_admin on public.org_memberships;
create policy org_memberships_insert_admin
on public.org_memberships
for insert
to authenticated
with check (
  public.has_org_role(org_id, array['owner', 'admin']::text[])
  or (
    user_id = auth.uid()
    and role = 'owner'
    and not public.org_has_members(org_id)
  )
);

drop policy if exists org_memberships_update_admin on public.org_memberships;
create policy org_memberships_update_admin
on public.org_memberships
for update
to authenticated
using (public.has_org_role(org_id, array['owner', 'admin']::text[]))
with check (public.has_org_role(org_id, array['owner', 'admin']::text[]));

-- Only owners can remove memberships.
drop policy if exists org_memberships_delete_owner on public.org_memberships;
create policy org_memberships_delete_owner
on public.org_memberships
for delete
to authenticated
using (public.has_org_role(org_id, array['owner']::text[]));
