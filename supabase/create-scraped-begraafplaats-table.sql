-- Create table for scraped begraafplaats data
-- This table stores website scraping results and AI-generated content

CREATE TABLE IF NOT EXISTS scraped_begraafplaats_data (
  id BIGSERIAL PRIMARY KEY,
  
  -- Basic identification
  begraafplaats_slug TEXT UNIQUE NOT NULL,
  begraafplaats_naam TEXT NOT NULL,
  gemeente TEXT NOT NULL,
  provincie TEXT NOT NULL,
  type TEXT NOT NULL,
  
  -- Website scraping data
  website_url TEXT,
  website_content TEXT,
  website_scraped_at TIMESTAMPTZ,
  website_structured_data JSONB,
  website_description TEXT,
  website_openingstijden TEXT,
  website_tarieven TEXT,
  website_faciliteiten TEXT[],
  website_historie TEXT,
  website_contact_info JSONB,
  website_fotos TEXT[],
  
  -- Google Maps data
  google_place_id TEXT,
  google_rating DECIMAL(2,1),
  google_review_count INTEGER,
  google_reviews JSONB,
  google_scraped_at TIMESTAMPTZ,
  google_photos TEXT[],
  google_opening_hours JSONB,
  google_website TEXT,
  google_phone TEXT,
  google_address TEXT,
  
  -- AI-generated content
  generated_content TEXT, -- JSON string with structured content
  generated_at TIMESTAMPTZ,
  generated_by TEXT,
  
  -- Status tracking
  scrape_status TEXT NOT NULL DEFAULT 'pending' CHECK (
    scrape_status IN ('pending', 'scraping', 'completed', 'failed', 'enrichment_failed')
  ),
  last_error TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scraped_begraafplaats_slug ON scraped_begraafplaats_data(begraafplaats_slug);
CREATE INDEX IF NOT EXISTS idx_scraped_begraafplaats_gemeente ON scraped_begraafplaats_data(gemeente);
CREATE INDEX IF NOT EXISTS idx_scraped_begraafplaats_provincie ON scraped_begraafplaats_data(provincie);
CREATE INDEX IF NOT EXISTS idx_scraped_begraafplaats_type ON scraped_begraafplaats_data(type);
CREATE INDEX IF NOT EXISTS idx_scraped_begraafplaats_status ON scraped_begraafplaats_data(scrape_status);
CREATE INDEX IF NOT EXISTS idx_scraped_begraafplaats_created_at ON scraped_begraafplaats_data(created_at);
CREATE INDEX IF NOT EXISTS idx_scraped_begraafplaats_updated_at ON scraped_begraafplaats_data(updated_at);

-- Create partial indexes for enriched content
CREATE INDEX IF NOT EXISTS idx_scraped_begraafplaats_with_content 
  ON scraped_begraafplaats_data(begraafplaats_slug) 
  WHERE generated_content IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_scraped_begraafplaats_with_website_content 
  ON scraped_begraafplaats_data(begraafplaats_slug) 
  WHERE website_content IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_scraped_begraafplaats_with_google_data 
  ON scraped_begraafplaats_data(begraafplaats_slug) 
  WHERE google_rating IS NOT NULL;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_scraped_begraafplaats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_scraped_begraafplaats_updated_at
  BEFORE UPDATE ON scraped_begraafplaats_data
  FOR EACH ROW
  EXECUTE FUNCTION update_scraped_begraafplaats_updated_at();

-- Create view for easy querying of enriched data
CREATE OR REPLACE VIEW enriched_begraafplaats_view AS
SELECT 
  begraafplaats_slug,
  begraafplaats_naam,
  gemeente,
  provincie,
  type,
  website_url,
  google_rating,
  google_review_count,
  generated_content,
  generated_at,
  scrape_status,
  CASE 
    WHEN generated_content IS NOT NULL THEN TRUE 
    ELSE FALSE 
  END as is_enriched,
  created_at,
  updated_at
FROM scraped_begraafplaats_data
WHERE scrape_status IN ('completed', 'enrichment_failed')
ORDER BY updated_at DESC;

-- Add comments for documentation
COMMENT ON TABLE scraped_begraafplaats_data IS 'Stores scraped website data and AI-generated content for begraafplaatsen';
COMMENT ON COLUMN scraped_begraafplaats_data.begraafplaats_slug IS 'Unique slug identifier for the begraafplaats';
COMMENT ON COLUMN scraped_begraafplaats_data.website_content IS 'Raw website content scraped as markdown';
COMMENT ON COLUMN scraped_begraafplaats_data.generated_content IS 'AI-generated structured content as JSON string';
COMMENT ON COLUMN scraped_begraafplaats_data.scrape_status IS 'Current status of the scraping and enrichment process';
COMMENT ON COLUMN scraped_begraafplaats_data.google_reviews IS 'Array of Google Maps reviews as JSON';

-- Sample queries for reference:

/*
-- Get all begraafplaatsen ready for enrichment
SELECT begraafplaats_naam, gemeente, scrape_status
FROM scraped_begraafplaats_data 
WHERE website_content IS NOT NULL 
  AND generated_content IS NULL;

-- Get enrichment statistics
SELECT 
  scrape_status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM scraped_begraafplaats_data 
GROUP BY scrape_status 
ORDER BY count DESC;

-- Get recent activity
SELECT 
  begraafplaats_naam,
  gemeente,
  scrape_status,
  updated_at
FROM scraped_begraafplaats_data 
ORDER BY updated_at DESC 
LIMIT 10;

-- Get begraafplaatsen with highest ratings
SELECT 
  begraafplaats_naam,
  gemeente,
  google_rating,
  google_review_count
FROM scraped_begraafplaats_data 
WHERE google_rating IS NOT NULL 
ORDER BY google_rating DESC, google_review_count DESC 
LIMIT 10;

-- Get enrichment progress by province
SELECT 
  provincie,
  COUNT(*) as total,
  COUNT(generated_content) as enriched,
  ROUND(COUNT(generated_content) * 100.0 / COUNT(*), 2) as enrichment_rate
FROM scraped_begraafplaats_data 
GROUP BY provincie 
ORDER BY enrichment_rate DESC;
*/

-- Grant necessary permissions (adjust based on your RLS policies)
-- These should be run by a superuser or database owner

-- Enable RLS (Row Level Security) if needed
-- ALTER TABLE scraped_begraafplaats_data ENABLE ROW LEVEL SECURITY;

-- Example RLS policy for authenticated users
-- CREATE POLICY "Allow read access for authenticated users" ON scraped_begraafplaats_data
--   FOR SELECT USING (auth.role() = 'authenticated');

-- Example RLS policy for service role
-- CREATE POLICY "Allow all operations for service role" ON scraped_begraafplaats_data
--   FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');