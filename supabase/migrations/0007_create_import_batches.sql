create table if not exists public.import_batches (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  file_name text,
  file_type text not null,
  status text not null default 'processing',
  total_rows int,
  matched_rows int,
  unmatched_rows int,
  ai_cleaned boolean not null default false,
  error_log jsonb not null default '[]'::jsonb,
  uploaded_by uuid not null references public.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint import_batches_file_type_chk check (file_type in ('csv', 'xlsx', 'manual')),
  constraint import_batches_status_chk check (status in ('processing', 'needs_review', 'completed', 'failed')),
  constraint import_batches_total_rows_chk check (total_rows is null or total_rows >= 0),
  constraint import_batches_matched_rows_chk check (matched_rows is null or matched_rows >= 0),
  constraint import_batches_unmatched_rows_chk check (unmatched_rows is null or unmatched_rows >= 0)
);

create index if not exists idx_import_batches_org_id on public.import_batches (org_id);
create index if not exists idx_import_batches_status on public.import_batches (status);
create index if not exists idx_import_batches_uploaded_by on public.import_batches (uploaded_by);
create index if not exists idx_import_batches_created_at on public.import_batches (created_at);

alter table public.import_batches enable row level security;

drop policy if exists import_batches_member_select on public.import_batches;
create policy import_batches_member_select
on public.import_batches
for select
to authenticated
using (public.is_org_member(org_id));

drop policy if exists import_batches_uploader_insert on public.import_batches;
create policy import_batches_uploader_insert
on public.import_batches
for insert
to authenticated
with check (
  public.is_org_member(org_id)
  and uploaded_by = auth.uid()
);

drop policy if exists import_batches_uploader_update on public.import_batches;
create policy import_batches_uploader_update
on public.import_batches
for update
to authenticated
using (
  public.is_org_member(org_id)
  and uploaded_by = auth.uid()
)
with check (
  public.is_org_member(org_id)
  and uploaded_by = auth.uid()
);

drop policy if exists import_batches_uploader_delete on public.import_batches;
create policy import_batches_uploader_delete
on public.import_batches
for delete
to authenticated
using (
  public.is_org_member(org_id)
  and uploaded_by = auth.uid()
);
