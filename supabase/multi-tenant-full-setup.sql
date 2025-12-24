-- Complete Multi-tenant database setup voor ALLE directory websites
-- Dit maakt het mogelijk om één Supabase database te delen tussen 7+ websites!

-- 1. Drop oude tabellen als die bestaan (BACKUP EERST JE DATA!)
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS sites CASCADE;

-- 2. Maak een uitgebreide sites tabel voor alle websites
CREATE TABLE IF NOT EXISTS sites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    domain VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- Type directory (kinderopvang, tandarts, uitvaart, etc)
    language VARCHAR(10) DEFAULT 'nl', -- Voor internationale sites zoals Thailand
    created_at TIMESTAMPTZ DEFAULT NOW(),
    active BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}' -- Voor site-specifieke settings
);

-- 3. Voeg ALLE websites toe
INSERT INTO sites (domain, name, description, category, language) VALUES
    -- Bestaande sites
    ('kinderopvang-indebuurt.nl', 'Kinderopvang in de Buurt', 'Directory voor kinderopvang in Nederland', 'kinderopvang', 'nl'),
    ('begraafplaatsindebuurt.nl', 'Begraafplaats in de Buurt', 'Directory voor begraafplaatsen in Nederland', 'uitvaart', 'nl'),
    
    -- Nieuwe sites
    ('vindtandarts.nl', 'Vind Tandarts', 'Vind de beste tandarts bij u in de buurt', 'gezondheid', 'nl'),
    ('go2-thailand.com', 'Go2 Thailand', 'Your complete guide to Thailand travel', 'travel', 'en'),
    ('cremetoriumindebuurt.nl', 'Crematorium in de Buurt', 'Directory voor crematoria in Nederland', 'uitvaart', 'nl'),
    ('ouderenzorgindebuurt.nl', 'Ouderenzorg in de Buurt', 'Vind ouderenzorg faciliteiten in uw omgeving', 'zorg', 'nl'),
    ('uitvaartzorgindebuurt.nl', 'Uitvaartzorg in de Buurt', 'Complete gids voor uitvaartzorg in Nederland', 'uitvaart', 'nl')
ON CONFLICT (domain) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    language = EXCLUDED.language;

-- 4. Maak uitgebreide feedback tabel
CREATE TABLE IF NOT EXISTS feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    page_url TEXT NOT NULL,
    page_title TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    type VARCHAR(50) NOT NULL DEFAULT 'form',
    user_agent TEXT,
    ip_address TEXT,
    language VARCHAR(10), -- Voor meertalige feedback
    metadata JSONB DEFAULT '{}', -- Extra data per site type
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Uitgebreide indexes voor performance
CREATE INDEX idx_feedback_site_id ON feedback(site_id);
CREATE INDEX idx_feedback_site_timestamp ON feedback(site_id, timestamp DESC);
CREATE INDEX idx_feedback_site_type ON feedback(site_id, type);
CREATE INDEX idx_feedback_rating ON feedback(rating);
CREATE INDEX idx_sites_category ON sites(category);
CREATE INDEX idx_sites_active ON sites(active);

-- 6. Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- 7. Policies voor feedback
DROP POLICY IF EXISTS "Anyone can insert feedback for any site" ON feedback;
DROP POLICY IF EXISTS "Service role can read all feedback" ON feedback;

CREATE POLICY "Anyone can insert feedback for any site" 
ON feedback FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Service role can read all feedback" 
ON feedback FOR SELECT 
TO service_role 
USING (true);

CREATE POLICY "Service role can delete feedback" 
ON feedback FOR DELETE 
TO service_role 
USING (true);

-- 8. Policies voor sites
DROP POLICY IF EXISTS "Anyone can read active sites" ON sites;

CREATE POLICY "Anyone can read active sites" 
ON sites FOR SELECT 
TO anon 
USING (active = true);

-- 9. Helper functies
CREATE OR REPLACE FUNCTION get_site_id(domain_name TEXT)
RETURNS UUID AS $$
    SELECT id FROM sites WHERE domain = domain_name AND active = true LIMIT 1;
$$ LANGUAGE sql STABLE;

-- Functie om sites per categorie op te halen
CREATE OR REPLACE FUNCTION get_sites_by_category(cat TEXT)
RETURNS SETOF sites AS $$
    SELECT * FROM sites WHERE category = cat AND active = true ORDER BY name;
$$ LANGUAGE sql STABLE;

-- 10. Uitgebreide views
DROP VIEW IF EXISTS feedback_by_site CASCADE;
CREATE OR REPLACE VIEW feedback_by_site AS
SELECT 
    f.*,
    s.domain,
    s.name as site_name,
    s.category as site_category,
    s.language as site_language
FROM feedback f
JOIN sites s ON f.site_id = s.id;

-- 11. Uitgebreide stats view
DROP VIEW IF EXISTS feedback_stats_by_site CASCADE;
CREATE OR REPLACE VIEW feedback_stats_by_site AS
SELECT 
    s.domain,
    s.name as site_name,
    s.category,
    DATE(f.timestamp) as date,
    COUNT(*) as total_feedback,
    COUNT(CASE WHEN f.type = 'ribbon' THEN 1 END) as ribbon_feedback,
    COUNT(CASE WHEN f.type = 'form' THEN 1 END) as form_feedback,
    AVG(f.rating) as average_rating,
    COUNT(DISTINCT f.page_url) as unique_pages,
    COUNT(DISTINCT f.ip_address) as unique_visitors
FROM feedback f
JOIN sites s ON f.site_id = s.id
GROUP BY s.domain, s.name, s.category, DATE(f.timestamp)
ORDER BY date DESC;

-- 12. Category stats view
CREATE OR REPLACE VIEW feedback_stats_by_category AS
SELECT 
    s.category,
    COUNT(DISTINCT s.id) as total_sites,
    COUNT(f.id) as total_feedback,
    AVG(f.rating) as average_rating,
    COUNT(DISTINCT f.ip_address) as unique_visitors
FROM sites s
LEFT JOIN feedback f ON s.id = f.site_id
WHERE s.active = true
GROUP BY s.category
ORDER BY total_feedback DESC;

-- 13. Recent feedback view (voor admin dashboard)
CREATE OR REPLACE VIEW recent_feedback AS
SELECT 
    f.*,
    s.domain,
    s.name as site_name,
    s.category
FROM feedback f
JOIN sites s ON f.site_id = s.id
ORDER BY f.timestamp DESC
LIMIT 100;

-- 14. Test data voor alle sites
INSERT INTO feedback (site_id, feedback, rating, page_url, page_title, type, language)
SELECT 
    s.id,
    CASE s.category
        WHEN 'kinderopvang' THEN 'Geweldige kinderopvang, zeer tevreden!'
        WHEN 'gezondheid' THEN 'Professionele tandarts, aanrader!'
        WHEN 'travel' THEN 'Amazing travel tips for Thailand!'
        WHEN 'uitvaart' THEN 'Respectvolle en professionele service'
        WHEN 'zorg' THEN 'Uitstekende zorg voor mijn moeder'
        ELSE 'Zeer goede service!'
    END,
    4 + (RANDOM() * 2)::int, -- Rating tussen 4-5
    '/',
    s.name || ' - Homepage',
    CASE WHEN RANDOM() > 0.5 THEN 'ribbon' ELSE 'form' END,
    s.language
FROM sites s
WHERE s.active = true;

-- 15. Controleer resultaat
SELECT 
    s.category,
    s.name,
    COUNT(f.id) as feedback_count,
    AVG(f.rating)::numeric(3,1) as avg_rating
FROM sites s
LEFT JOIN feedback f ON s.id = f.site_id
GROUP BY s.category, s.name
ORDER BY s.category, s.name;