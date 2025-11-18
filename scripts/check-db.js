import { config } from 'dotenv';
import { sql } from '@vercel/postgres';

config();

async function checkDatabase() {
  try {
    // Check table structure
    const structure = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'links' 
      ORDER BY ordinal_position
    `;
    
    console.log('\n✅ Table Structure:');
    structure.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Check row count
    const count = await sql`SELECT COUNT(*) as total FROM links`;
    console.log(`\n📊 Total links: ${count.rows[0].total}`);
    
    // Show sample data if exists
    if (count.rows[0].total > 0) {
      const links = await sql`
        SELECT code, long_url, total_clicks, created_at 
        FROM links 
        ORDER BY created_at DESC 
        LIMIT 5
      `;
      console.log('\n📝 Sample links:');
      links.rows.forEach(link => {
        console.log(`  - ${link.code} -> ${link.long_url} (${link.total_clicks} clicks)`);
      });
    } else {
      console.log('\nℹ️  No links in database yet.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
