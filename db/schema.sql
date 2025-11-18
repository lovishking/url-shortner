-- TinyLink Database Schema
-- PostgreSQL schema for URL shortener
-- Create links table
CREATE TABLE
    IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        code VARCHAR(8) UNIQUE NOT NULL,
        long_url TEXT NOT NULL,
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            total_clicks INTEGER DEFAULT 0,
            last_clicked TIMESTAMP
        WITH
            TIME ZONE
    );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_links_code ON links (code);

CREATE INDEX IF NOT EXISTS idx_links_created_at ON links (created_at DESC);

-- Sample queries:
-- Insert a new link:
-- INSERT INTO links (code, long_url) VALUES ('abc123', 'https://example.com');
-- Get all links:
-- SELECT * FROM links ORDER BY created_at DESC;
-- Get link by code:
-- SELECT * FROM links WHERE code = 'abc123';
-- Increment clicks:
-- UPDATE links SET total_clicks = total_clicks + 1, last_clicked = CURRENT_TIMESTAMP WHERE code = 'abc123';
-- Delete link:
-- DELETE FROM links WHERE code = 'abc123';