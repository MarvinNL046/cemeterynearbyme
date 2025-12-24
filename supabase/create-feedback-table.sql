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
CREATE INDEX idx_feedback_page_url ON feedback(page_url);

-- Enable Row Level Security (RLS)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (for feedback submission)
CREATE POLICY "Anyone can insert feedback" ON feedback
    FOR INSERT TO anon
    WITH CHECK (true);

-- Create policy to allow service role to read all feedback
CREATE POLICY "Service role can read all feedback" ON feedback
    FOR SELECT TO service_role
    USING (true);

-- Create a view for feedback statistics
CREATE OR REPLACE VIEW feedback_stats AS
SELECT 
    DATE(timestamp) as date,
    COUNT(*) as total_feedback,
    COUNT(CASE WHEN type = 'ribbon' THEN 1 END) as ribbon_feedback,
    COUNT(CASE WHEN type = 'form' THEN 1 END) as form_feedback,
    AVG(rating) as average_rating,
    COUNT(DISTINCT page_url) as unique_pages
FROM feedback
GROUP BY DATE(timestamp)
ORDER BY date DESC;