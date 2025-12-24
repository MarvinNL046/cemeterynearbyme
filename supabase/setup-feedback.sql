-- Maak de feedback tabel
CREATE TABLE IF NOT EXISTS feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Maak indexes voor betere performance
CREATE INDEX IF NOT EXISTS idx_feedback_timestamp ON feedback(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);

-- Enable Row Level Security
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Verwijder bestaande policies als ze bestaan
DROP POLICY IF EXISTS "Anyone can insert feedback" ON feedback;
DROP POLICY IF EXISTS "Authenticated users can view all feedback" ON feedback;

-- Sta iedereen toe om feedback te sturen
CREATE POLICY "Anyone can insert feedback" 
ON feedback FOR INSERT 
TO anon 
WITH CHECK (true);

-- Alleen authenticated users kunnen feedback lezen (voor admin)
CREATE POLICY "Authenticated users can view all feedback" 
ON feedback FOR SELECT 
TO authenticated 
USING (true);

-- Test data toevoegen
INSERT INTO feedback (feedback, rating, page_url, page_title, type)
VALUES 
  ('Geweldige website! Heel handig om kinderopvang te vinden.', 5, '/', 'Kinderopvang in de Buurt - Homepage', 'ribbon'),
  ('De zoekfunctie werkt perfect!', 4, '/provincie/noord-holland', 'Noord-Holland - Kinderopvang', 'form'),
  ('Meer informatie over prijzen zou fijn zijn.', 3, '/type/bso', 'BSO - Buitenschoolse opvang', 'form');

-- Controleer of alles werkt
SELECT COUNT(*) as total_feedback FROM feedback;