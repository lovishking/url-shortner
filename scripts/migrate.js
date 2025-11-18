import { config } from 'dotenv';
import { sql } from '@vercel/postgres';

// Load environment variables
config();

async function migrate() {
  try {
    console.log('Starting migration...');

    // Create links table
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

    console.log('✅ Table "links" created');

    // Create indexes
    await sql`
      CREATE INDEX IF NOT EXISTS idx_links_code ON links(code);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at DESC);
    `;

    console.log('✅ Indexes created');
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

migrate();
