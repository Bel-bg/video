# IG-Live Video Backend

This is the backend service for the video functionality of the IG-Live social network application.

## Features

- Video upload to ImageKit
- Video storage and management in Supabase
- Like and comment functionality
- Automatic cleanup of videos older than 2 weeks
- Real-time updates for likes, comments, and views

## API Endpoints

### Videos

- `GET /api/videos/feed` - Get video feed
- `GET /api/videos/:id` - Get a specific video
- `POST /api/videos` - Upload a new video
- `DELETE /api/videos/:id` - Delete a video

### Interactions

- `POST /api/videos/:id/like` - Like/unlike a video
- `GET /api/videos/:id/comments` - Get comments for a video
- `POST /api/videos/:id/comment` - Add a comment to a video

### Authentication

- `GET /api/auth/imagekit` - Get ImageKit authentication parameters

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example` and fill in your credentials

3. Run the server:
   ```
   npm start
   ```

## Database Schema

The backend uses Supabase with the following tables:

- `videos` - Stores video metadata
- `video_likes` - Tracks video likes
- `video_comments` - Stores video comments

## Automatic Cleanup

Videos older than 2 weeks are automatically deleted using a cron job that runs the SQL script in `database/cleanup.sql`.

## Environment Variables

- `PORT` - Server port (default: 3000)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `IMAGEKIT_PUBLIC_KEY` - ImageKit public key
- `IMAGEKIT_PRIVATE_KEY` - ImageKit private key
- `IMAGEKIT_URL_ENDPOINT` - ImageKit URL endpoint
