-- verify.sql
-- This script verifies that all tables and functions have been created correctly

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('videos', 'video_likes', 'video_comments');

-- Check if functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('increment_video_views', 'increment_video_likes', 'decrement_video_likes', 'increment_video_comments');

-- Check if indexes exist
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('videos', 'video_likes', 'video_comments');

-- Check if RLS is enabled
SELECT tablename, relrowsecurity 
FROM pg_class c 
JOIN pg_namespace n ON n.oid = c.relnamespace 
WHERE n.nspname = 'public' 
AND relname IN ('videos', 'video_likes', 'video_comments');