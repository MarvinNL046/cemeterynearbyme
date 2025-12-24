-- Multi-tenant database setup voor meerdere directory websites
-- Dit maakt het mogelijk om één Supabase database te delen

-- 1. Drop oude feedback tabel als die bestaat
DROP TABLE IF EXISTS feedback CASCADE;

-- 2. Maak een sites tabel voor alle websites
CREATE TABLE IF NOT EXISTS sites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    domain VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    active BOOLEAN DEFAULT true
);

-- 3. Voeg de websites toe
INSERT INTO sites (domain, name, description) VALUES
    ('kinderopvang-indebuurt.nl', 'Kinderopvang in de Buurt', 'Directory voor kinderopvang in Nederland'),
    ('begraafplaatsindebuurt.nl', 'Begraafplaats in de Buurt', 'Directory voor begraafplaatsen in Nederland')
ON CONFLICT (domain) DO NOTHING;

-- 4. Maak nieuwe feedback tabel met site_id
CREATE TABLE IF NOT EXISTS feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    site_id UUID NOT NULL REFERENCES sites(id),
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    page_url TEXT NOT NULL,
    page_title TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    type VARCHAR(50) NOT NULL DEFAULT 'form',
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Indexes voor performance
CREATE INDEX idx_feedback_site_id ON feedback(site_id);
CREATE INDEX idx_feedback_site_timestamp ON feedback(site_id, timestamp DESC);
CREATE INDEX idx_feedback_site_type ON feedback(site_id, type);

-- 6. Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- 7. Policies voor feedback
CREATE POLICY "Anyone can insert feedback for any site" 
ON feedback FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Service role can read all feedback" 
ON feedback FOR SELECT 
TO service_role 
USING (true);

-- 8. Policies voor sites
CREATE POLICY "Anyone can read active sites" 
ON sites FOR SELECT 
TO anon 
USING (active = true);

-- 9. Functie om site_id te krijgen op basis van domain
CREATE OR REPLACE FUNCTION get_site_id(domain_name TEXT)
RETURNS UUID AS $$
    SELECT id FROM sites WHERE domain = domain_name AND active = true LIMIT 1;
$$ LANGUAGE sql STABLE;

-- 10. View voor feedback per site
CREATE OR REPLACE VIEW feedback_by_site AS
SELECT 
    f.*,
    s.domain,
    s.name as site_name
FROM feedback f
JOIN sites s ON f.site_id = s.id;

-- 11. Stats view per site
CREATE OR REPLACE VIEW feedback_stats_by_site AS
SELECT 
    s.domain,
    s.name as site_name,
    DATE(f.timestamp) as date,
    COUNT(*) as total_feedback,
    COUNT(CASE WHEN f.type = 'ribbon' THEN 1 END) as ribbon_feedback,
    COUNT(CASE WHEN f.type = 'form' THEN 1 END) as form_feedback,
    AVG(f.rating) as average_rating,
    COUNT(DISTINCT f.page_url) as unique_pages
FROM feedback f
JOIN sites s ON f.site_id = s.id
GROUP BY s.domain, s.name, DATE(f.timestamp)
ORDER BY date DESC;