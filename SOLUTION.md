# IG-Live Video Backend Solution

## Overview

This document provides a comprehensive overview of the video backend solution implemented for the IG-Live social network application. The solution includes a complete backend system that handles video storage, user interactions, and data management using Node.js and Supabase.

## Architecture

The solution follows a modern, scalable architecture:

```
┌─────────────────┐    ┌──────────────┐    ┌──────────────┐
│   Mobile App    │────│  ImageKit    │────│   Internet   │
└─────────────────┘    └──────────────┘    └──────────────┘
         │                       │                  │
         ▼                       ▼                  ▼
┌─────────────────┐    ┌──────────────┐    ┌──────────────┐
│ Video Backend   │────│  Supabase    │────│   Database   │
│ (Node.js)       │    │  (Storage)   │    │   (PostgreSQL)│
└─────────────────┘    └──────────────┘    └──────────────┘
```

## Components

### 1. Video Backend (Node.js/Express)

The backend is built with Node.js and Express, providing RESTful APIs for all video-related operations.

**Key Features:**

- Video upload and management
- Like and comment functionality
- User authentication and authorization
- Real-time updates for interactions
- Automatic cleanup of old videos (2-week retention)

**API Endpoints:**

- `GET /api/videos/feed` - Get video feed
- `GET /api/videos/:id` - Get specific video
- `POST /api/videos` - Upload video
- `DELETE /api/videos/:id` - Delete video
- `POST /api/videos/:id/like` - Like/unlike video
- `GET /api/videos/:id/comments` - Get video comments
- `POST /api/videos/:id/comment` - Add comment
- `GET /api/auth/imagekit` - Get ImageKit auth params

### 2. ImageKit Integration

Videos are stored on ImageKit for optimized delivery:

- High-performance video hosting
- Automatic format optimization
- Global CDN delivery
- Secure token-based uploads

### 3. Supabase Database

All metadata and user interactions are stored in Supabase:

**Tables:**

- `videos` - Video metadata
- `video_likes` - Video likes tracking
- `video_comments` - Video comments

**Functions:**

- `increment_video_views()` - Increment view count
- `increment_video_likes()` - Increment like count
- `decrement_video_likes()` - Decrement like count
- `increment_video_comments()` - Increment comment count

### 4. Mobile Frontend Integration

The React Native frontend in the `app/Media` directory has been updated to work with the new backend:

- Video upload to ImageKit
- Video feed display
- Like/comment interactions
- Real-time updates

## Database Schema

### Videos Table

```sql
CREATE TABLE videos (
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
```

### Video Likes Table

```sql
CREATE TABLE video_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(video_id, user_id)
);
```

### Video Comments Table

```sql
CREATE TABLE video_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Security Features

- User authentication with Supabase tokens
- Row Level Security (RLS) policies
- Input validation and sanitization
- Rate limiting
- Secure ImageKit uploads

## Performance Optimizations

- Database indexing for fast queries
- Function-based counters for atomic operations
- Connection pooling
- Response caching (planned)

## Deployment

The backend can be deployed in multiple ways:

1. **Traditional Hosting:**

   ```bash
   npm install
   npm start
   ```

2. **Docker:**

   ```bash
   docker build -t ig-live-video-backend .
   docker run -p 3000:3000 ig-live-video-backend
   ```

3. **Cloud Platforms:**
   - Heroku
   - AWS Elastic Beanstalk
   - Google Cloud Run
   - Azure App Service

## Cron Jobs

Automatic cleanup of videos older than 2 weeks:

```sql
DELETE FROM videos
WHERE created_at < NOW() - INTERVAL '14 days';
```

This should be run daily via cron or a scheduled job.

## Environment Variables

Create a `.env` file with:

```env
# Server Configuration
PORT=3000

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

## Testing

The backend includes comprehensive tests:

- Unit tests for models and controllers
- Integration tests for API endpoints
- Performance tests
- Security tests

Run tests with:

```bash
npm test
```

## Monitoring

Built-in health check endpoint:

```
GET /api/health
```

Response:

```json
{
  "status": "OK",
  "message": "IG-Live Video Backend is running",
  "timestamp": "2023-10-07T12:00:00.000Z"
}
```

## Future Enhancements

1. **Advanced Analytics**

   - Video playback tracking
   - User engagement metrics
   - Content performance reports

2. **Content Moderation**

   - AI-powered content filtering
   - Reporting system
   - Automated moderation workflows

3. **Enhanced Social Features**

   - Video sharing between users
   - Collaborative playlists
   - Group viewing sessions

4. **Monetization**
   - Ad integration
   - Premium content
   - Creator monetization tools

## Conclusion

This video backend solution provides a robust, scalable foundation for the IG-Live social network's video functionality. With its modern architecture, comprehensive feature set, and focus on performance and security, it's well-suited to handle the demands of a growing social platform.
