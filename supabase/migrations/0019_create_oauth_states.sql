-- ============================================================
-- Migration: Create oauth_states table for secure OAuth flows
-- ============================================================
-- Stores cryptographic state tokens bound to user sessions
-- to prevent CSRF and replay attacks during OAuth flows.

CREATE TABLE IF NOT EXISTS public.oauth_states (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id      uuid        REFERENCES public.organizations(id) ON DELETE SET NULL,
  provider    text        NOT NULL DEFAULT 'square',
  state_hash  text        NOT NULL UNIQUE,
  redirect_path text,
  used        boolean     NOT NULL DEFAULT false,
  expires_at  timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  used_at     timestamptz,

  CONSTRAINT oauth_states_provider_check CHECK (provider IN ('square'))
);

-- Index for fast lookups during callback validation
CREATE INDEX IF NOT EXISTS idx_oauth_states_state_hash ON public.oauth_states(state_hash);
CREATE INDEX IF NOT EXISTS idx_oauth_states_user_id ON public.oauth_states(user_id);

-- Enable RLS
ALTER TABLE public.oauth_states ENABLE ROW LEVEL SECURITY;

-- Policy: Only server-side routes (service_role) can insert/read/update.
-- Users should never access this table directly from the client.
-- The Square callback API route runs server-side with service role context.
CREATE POLICY "service_role_full_access" ON public.oauth_states
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Policy: Authenticated users can read their own states (for status checks)
CREATE POLICY "users_can_read_own_states" ON public.oauth_states
  FOR SELECT
  USING (auth.uid() = user_id);

-- Cleanup: Delete expired states after 24 hours (run via cron or manual cleanup)
COMMENT ON TABLE public.oauth_states IS
  'Stores OAuth state tokens bound to user sessions for CSRF/replay protection. '
  'Expired rows can be cleaned up periodically.';
