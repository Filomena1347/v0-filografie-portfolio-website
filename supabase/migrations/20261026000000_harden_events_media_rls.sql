-- The first events_media policies had no TO clause, so they applied to the "public" role
-- (which includes anon). They only blocked anonymous writes because auth.uid() is NULL
-- for anon, and anon still held write privileges on the table.
--
-- This migration makes the intent explicit:
--   * anyone (anon, authenticated) can SELECT
--   * only an authenticated user whose JWT carries app_metadata.role = 'admin' can write
--     (app_metadata can only be set server-side, never by a signed-up user)
--   * anon has no write privileges at all, and nobody can TRUNCATE through the API roles
-- The Next.js admin routes write with the server database connection after verifying the
-- admin session cookie, so they are not affected by these policies.

ALTER TABLE public.events_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS events_media_select_public ON public.events_media;
DROP POLICY IF EXISTS events_media_insert_authenticated ON public.events_media;
DROP POLICY IF EXISTS events_media_update_authenticated ON public.events_media;
DROP POLICY IF EXISTS events_media_delete_authenticated ON public.events_media;
DROP POLICY IF EXISTS events_media_insert_admin ON public.events_media;
DROP POLICY IF EXISTS events_media_update_admin ON public.events_media;
DROP POLICY IF EXISTS events_media_delete_admin ON public.events_media;

CREATE POLICY events_media_select_public ON public.events_media
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY events_media_insert_admin ON public.events_media
  FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY events_media_update_admin ON public.events_media
  FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY events_media_delete_admin ON public.events_media
  FOR DELETE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.events_media FROM anon;
REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.events_media FROM authenticated;
GRANT SELECT ON public.events_media TO anon, authenticated;
