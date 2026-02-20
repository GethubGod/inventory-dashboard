alter table public.suppliers
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists notes text,
  add column if not exists active boolean not null default true;

create index if not exists idx_suppliers_org_active on public.suppliers (org_id, active);
create index if not exists idx_suppliers_org_category on public.suppliers (org_id, category);
