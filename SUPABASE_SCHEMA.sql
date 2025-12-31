-- Supabase Database Schema for Educational Chatbot
-- Run this in Supabase SQL Editor

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT UNIQUE NOT NULL,
    name TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities table (chat history)
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    request TEXT NOT NULL,
    response TEXT NOT NULL,
    is_bookmarked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activities_student_id ON activities(student_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_bookmarked ON activities(student_id, is_bookmarked) WHERE is_bookmarked = TRUE;
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);

-- Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Allow all operations for now - adjust based on your auth setup)
-- For anonymous access (no authentication required)
CREATE POLICY "Allow all operations on students" ON students FOR ALL USING (true);
CREATE POLICY "Allow all operations on activities" ON activities FOR ALL USING (true);

-- Optional: If you want to restrict by student_id in the future
-- DROP POLICY "Allow all operations on activities" ON activities;
-- CREATE POLICY "Students can only see their own activities" ON activities 
--   FOR SELECT USING (student_id = current_setting('app.current_student_id', true));
-- CREATE POLICY "Students can only insert their own activities" ON activities 
--   FOR INSERT WITH CHECK (student_id = current_setting('app.current_student_id', true));

-- Comments
COMMENT ON TABLE students IS 'Stores student information';
COMMENT ON TABLE activities IS 'Stores chat interactions between students and AI';
COMMENT ON COLUMN activities.request IS 'Student question or prompt';
COMMENT ON COLUMN activities.response IS 'AI assistant response';
COMMENT ON COLUMN activities.is_bookmarked IS 'Whether student bookmarked this conversation';
