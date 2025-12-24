-- Create feedback table
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

-- Create indexes for better performance
CREATE INDEX idx_feedback_timestamp ON feedback(timestamp DESC);
CREATE INDEX idx_feedback_type ON feedback(type);
CREATE INDEX idx_feedback_rating ON feedback(rating);

-- Enable Row Level Security (RLS)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feedback
CREATE POLICY "Anyone can insert feedback" 
ON feedback FOR INSERT 
TO anon 
WITH CHECK (true);

-- Only authenticated users can view feedback (for admin)
CREATE POLICY "Authenticated users can view all feedback" 
ON feedback FOR SELECT 
TO authenticated 
USING (true);

-- Test insert
INSERT INTO feedback (feedback, rating, page_url, page_title, type)
VALUES 
  ('Great website, very helpful!', 5, '/', 'Homepage', 'ribbon'),
  ('Could use more information about BSO', 3, '/type/bso', 'BSO Page', 'form');