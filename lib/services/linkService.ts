import { sql } from '@vercel/postgres';
import { Link } from '../db/schema';
import { generateShortCode } from '../utils/validation';

export async function createLink(longUrl: string, customCode?: string): Promise<Link> {
  const code = customCode || generateShortCode(6);

  try {
    const result = await sql<Link>`
      INSERT INTO links (code, long_url)
      VALUES (${code}, ${longUrl})
      RETURNING *
    `;

    return result.rows[0];
  } catch (error: any) {
    // Handle unique constraint violation
    if (error.code === '23505' || error.message?.includes('unique')) {
      throw new Error('Code already exists');
    }
    throw error;
  }
}

export async function getAllLinks(): Promise<Link[]> {
  const result = await sql<Link>`
    SELECT * FROM links
    ORDER BY created_at DESC
  `;

  return result.rows;
}

export async function getLinkByCode(code: string): Promise<Link | null> {
  const result = await sql<Link>`
    SELECT * FROM links
    WHERE code = ${code}
    LIMIT 1
  `;

  return result.rows[0] || null;
}

export async function incrementClicks(code: string): Promise<void> {
  await sql`
    UPDATE links
    SET total_clicks = total_clicks + 1,
        last_clicked = CURRENT_TIMESTAMP
    WHERE code = ${code}
  `;
}

export async function deleteLink(code: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM links
    WHERE code = ${code}
  `;

  return result.rowCount !== null && result.rowCount > 0;
}
