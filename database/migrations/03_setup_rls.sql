-- 03_setup_rls.sql
-- This script sets up Row Level Security policies

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