-- 02_create_functions.sql
-- This script creates the utility functions for the video functionality

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