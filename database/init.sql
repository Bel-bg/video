-- init.sql
-- This script initializes the entire database schema for the video functionality

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    user_id TEXT NOT NULL,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create video_likes table
CREATE TABLE IF NOT EXISTS video_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(video_id, user_id)
);

-- Create video_comments table
CREATE TABLE IF NOT EXISTS video_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_video_likes_video_id ON video_likes(video_id);
CREATE INDEX IF NOT EXISTS idx_video_likes_user_id ON video_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_video_comments_video_id ON video_comments(video_id);
CREATE INDEX IF NOT EXISTS idx_video_comments_created_at ON video_comments(created_at DESC);

-- Create functions for incrementing counters
CREATE OR REPLACE FUNCTION increment_video_views(video_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE videos 
    SET views_count = views_count + 1 
    WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_video_likes(video_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE videos 
    SET likes_count = likes_count + 1 
    WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_video_likes(video_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE videos 
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_video_comments(video_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE videos 
    SET comments_count = comments_count + 1 
    WHERE id = video_id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for videos
CREATE POLICY "Users can view all videos" ON videos
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own videos" ON videos
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own videos" ON videos
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own videos" ON videos
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create policies for video_likes
CREATE POLICY "Users can view all likes" ON video_likes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own likes" ON video_likes
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own likes" ON video_likes
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create policies for video_comments
CREATE POLICY "Users can view all comments" ON video_comments
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments" ON video_comments
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own comments" ON video_comments
    FOR DELETE USING (auth.uid()::text = user_id);

-- Grant permissions
GRANT ALL ON videos TO authenticated;
GRANT ALL ON video_likes TO authenticated;
GRANT ALL ON video_comments TO authenticated;
GRANT EXECUTE ON FUNCTION increment_video_views(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_video_likes(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION decrement_video_likes(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_video_comments(UUID) TO authenticated;