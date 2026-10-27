import postgres from "postgres"

const globalForSql = globalThis as unknown as {
  sql?: ReturnType<typeof postgres>
}

// SUPABASE_DATABASE_URL is not managed by the Vercel-Supabase integration, which overwrites POSTGRES_PRISMA_URL on deploy.
const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.POSTGRES_PRISMA_URL

// Without a URL, postgres.js silently falls back to 127.0.0.1:5432 (ECONNREFUSED on Vercel).
if (!connectionString) {
  throw new Error("No database connection string found. Set SUPABASE_DATABASE_URL.")
}

export const sql =
  globalForSql.sql ??
  postgres(connectionString, {
    ssl: "require",
    prepare: false,
  })

if (process.env.NODE_ENV !== "production") globalForSql.sql = sql

let schemaReady: Promise<void> | null = null

export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS media_items (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          type text NOT NULL,
          section text NOT NULL,
          category text,
          title text,
          public_id text NOT NULL,
          url text NOT NULL,
          thumbnail_url text,
          width integer,
          height integer,
          sort_order integer NOT NULL DEFAULT 0,
          published boolean NOT NULL DEFAULT true,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `
      // Backfill column for pre-existing tables
      await sql`ALTER TABLE media_items ADD COLUMN IF NOT EXISTS thumbnail_url text`
      await sql`ALTER TABLE media_items ADD COLUMN IF NOT EXISTS media_type text`
      await sql`ALTER TABLE media_items ADD COLUMN IF NOT EXISTS cloudinary_public_id text`
      await sql`ALTER TABLE media_items ADD COLUMN IF NOT EXISTS all_sort_order integer`
      await sql`ALTER TABLE media_items ADD COLUMN IF NOT EXISTS show_in_vse boolean NOT NULL DEFAULT true`
      await sql`ALTER TABLE media_items ADD COLUMN IF NOT EXISTS is_wide boolean NOT NULL DEFAULT false`
      // sort_order stays the desktop order; the mobile order starts as a copy of it.
      await sql`ALTER TABLE media_items ADD COLUMN IF NOT EXISTS sort_order_mobile integer`
      await sql`ALTER TABLE media_items ADD COLUMN IF NOT EXISTS all_sort_order_mobile integer`
      await sql`UPDATE media_items SET sort_order_mobile = sort_order WHERE sort_order_mobile IS NULL`
      await sql`UPDATE media_items SET all_sort_order_mobile = all_sort_order WHERE all_sort_order_mobile IS NULL AND all_sort_order IS NOT NULL`
    })().catch((err) => {
      // reset so a later request can retry schema creation
      schemaReady = null
      throw err
    })
  }
  return schemaReady
}
