alter table public.locations add column if not exists org_id uuid;
alter table public.inventory_items add column if not exists org_id uuid;
alter table public.suppliers add column if not exists org_id uuid;
alter table public.orders add column if not exists org_id uuid;
alter table public.order_items add column if not exists org_id uuid;
alter table public.past_orders add column if not exists org_id uuid;
alter table public.storage_areas add column if not exists org_id uuid;
alter table public.area_items add column if not exists org_id uuid;
alter table public.stock_updates add column if not exists org_id uuid;
alter table public.profiles add column if not exists org_id uuid;

do $$
declare
  v_default_org_id uuid;
begin
  insert into public.organizations (name, slug, plan, settings)
  values ('Default Organization', 'default-org', 'free', '{}'::jsonb)
  on conflict (slug)
  do update set updated_at = now()
  returning id into v_default_org_id;

  if v_default_org_id is null then
    select o.id
    into v_default_org_id
    from public.organizations o
    where o.slug = 'default-org'
    limit 1;
  end if;

  if v_default_org_id is null then
    raise exception 'Unable to resolve default organization id for slug default-org';
  end if;

  update public.locations set org_id = v_default_org_id where org_id is null;
  update public.inventory_items set org_id = v_default_org_id where org_id is null;
  update public.suppliers set org_id = v_default_org_id where org_id is null;
  update public.orders set org_id = v_default_org_id where org_id is null;
  update public.order_items set org_id = v_default_org_id where org_id is null;
  update public.past_orders set org_id = v_default_org_id where org_id is null;
  update public.storage_areas set org_id = v_default_org_id where org_id is null;
  update public.area_items set org_id = v_default_org_id where org_id is null;
  update public.stock_updates set org_id = v_default_org_id where org_id is null;
  update public.profiles set org_id = v_default_org_id where org_id is null;

  insert into public.org_memberships (org_id, user_id, role, invited_at, accepted_at)
  select v_default_org_id, u.id, 'admin', now(), now()
  from public.users u
  on conflict (org_id, user_id) do nothing;

  update public.org_memberships m
  set role = 'owner'
  where m.id = (
    select m2.id
    from public.org_memberships m2
    where m2.org_id = v_default_org_id
    order by m2.created_at asc
    limit 1
  );
end;
$$;

alter table public.locations alter column org_id set not null;
alter table public.inventory_items alter column org_id set not null;
alter table public.suppliers alter column org_id set not null;
alter table public.orders alter column org_id set not null;
alter table public.order_items alter column org_id set not null;
alter table public.past_orders alter column org_id set not null;
alter table public.storage_areas alter column org_id set not null;
alter table public.area_items alter column org_id set not null;
alter table public.stock_updates alter column org_id set not null;
alter table public.profiles alter column org_id set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'locations_org_id_fkey') then
    alter table public.locations
      add constraint locations_org_id_fkey
      foreign key (org_id) references public.organizations(id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'inventory_items_org_id_fkey') then
    alter table public.inventory_items
      add constraint inventory_items_org_id_fkey
      foreign key (org_id) references public.organizations(id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'suppliers_org_id_fkey') then
    alter table public.suppliers
      add constraint suppliers_org_id_fkey
      foreign key (org_id) references public.organizations(id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'orders_org_id_fkey') then
    alter table public.orders
      add constraint orders_org_id_fkey
      foreign key (org_id) references public.organizations(id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'order_items_org_id_fkey') then
    alter table public.order_items
      add constraint order_items_org_id_fkey
      foreign key (org_id) references public.organizations(id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'past_orders_org_id_fkey') then
    alter table public.past_orders
      add constraint past_orders_org_id_fkey
      foreign key (org_id) references public.organizations(id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'storage_areas_org_id_fkey') then
    alter table public.storage_areas
      add constraint storage_areas_org_id_fkey
      foreign key (org_id) references public.organizations(id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'area_items_org_id_fkey') then
    alter table public.area_items
      add constraint area_items_org_id_fkey
      foreign key (org_id) references public.organizations(id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'stock_updates_org_id_fkey') then
    alter table public.stock_updates
      add constraint stock_updates_org_id_fkey
      foreign key (org_id) references public.organizations(id) on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'profiles_org_id_fkey') then
    alter table public.profiles
      add constraint profiles_org_id_fkey
      foreign key (org_id) references public.organizations(id) on delete cascade;
  end if;
end;
$$;

create index if not exists idx_locations_org_id on public.locations (org_id);
create index if not exists idx_inventory_items_org_id on public.inventory_items (org_id);
create index if not exists idx_suppliers_org_id on public.suppliers (org_id);
create index if not exists idx_orders_org_id on public.orders (org_id);
create index if not exists idx_order_items_org_id on public.order_items (org_id);
create index if not exists idx_past_orders_org_id on public.past_orders (org_id);
create index if not exists idx_storage_areas_org_id on public.storage_areas (org_id);
create index if not exists idx_area_items_org_id on public.area_items (org_id);
create index if not exists idx_stock_updates_org_id on public.stock_updates (org_id);
create index if not exists idx_profiles_org_id on public.profiles (org_id);
