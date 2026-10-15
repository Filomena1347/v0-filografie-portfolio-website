import postgres from "postgres"

const globalForSql = globalThis as unknown as {
  sql?: ReturnType<typeof postgres>
}

const connectionString = process.env.POSTGRES_PRISMA_URL

// Without a URL, postgres.js silently falls back to 127.0.0.1:5432 (ECONNREFUSED on Vercel).
if (!connectionString) {
  throw new Error("POSTGRES_PRISMA_URL is not set")
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
    })().catch((err) => {
      // reset so a later request can retry schema creation
      schemaReady = null
      throw err
    })
  }
  return schemaReady
}
