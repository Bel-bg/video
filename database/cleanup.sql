-- Cron job to delete videos older than 2 weeks
-- This should be run daily

DELETE FROM videos 
WHERE created_at < NOW() - INTERVAL '14 days';