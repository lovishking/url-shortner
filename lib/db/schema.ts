import { sql } from '@vercel/postgres';

export interface Link {
  id: number;
  code: string;
  long_url: string;
  created_at: Date;
  total_clicks: number;
  last_clicked: Date | null;
}

export async function createLinksTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS links (
      id SERIAL PRIMARY KEY,
      code VARCHAR(8) UNIQUE NOT NULL,
      long_url TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      total_clicks INTEGER DEFAULT 0,
      last_clicked TIMESTAMP WITH TIME ZONE
    );
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at DESC);
  `;
}

export async function dropLinksTable() {
  await sql`DROP TABLE IF EXISTS links;`;
}
