// generateDocs.js
// This script generates documentation

const fs = require("fs");
const path = require("path");

function generateAPIDocs() {
  const apiDocs = `
# API Documentation

## Video Endpoints

### GET /api/videos/feed
Get a feed of videos.

**Query Parameters:**
- limit (optional, default: 10) - Number of videos to return

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Video Title",
      "description": "Video Description",
      "video_url": "https://ik.imagekit.io/...",
      "thumbnail_url": "https://ik.imagekit.io/...",
      "views_count": 100,
      "likes_count": 10,
      "comments_count": 5,
      "created_at": "2023-10-07T12:00:00.000Z",
      "user_id": "user-uuid",
      "users": {
        "username": "john_doe",
        "avatar": "https://ik.imagekit.io/...",
        "verified": false
      }
    }
  ],
  "message": "Video feed retrieved successfully"
}
\`\`\`

### GET /api/videos/:id
Get a specific video by ID.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Video Title",
    "description": "Video Description",
    "video_url": "https://ik.imagekit.io/...",
    "thumbnail_url": "https://ik.imagekit.io/...",
    "views_count": 100,
    "likes_count": 10,
    "comments_count": 5,
    "created_at": "2023-10-07T12:00:00.000Z",
    "user_id": "user-uuid",
    "users": {
      "username": "john_doe",
      "avatar": "https://ik.imagekit.io/...",
      "verified": false
    }
  },
  "message": "Video retrieved successfully"
}
\`\`\`

### POST /api/videos
Upload a new video.

**Headers:**
- Authorization: Bearer <user-id>

**Body:**
\`\`\`json
{
  "title": "Video Title",
  "description": "Video Description",
  "video_url": "https://ik.imagekit.io/...",
  "thumbnail_url": "https://ik.imagekit.io/..."
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Video Title",
    "description": "Video Description",
    "video_url": "https://ik.imagekit.io/...",
    "thumbnail_url": "https://ik.imagekit.io/...",
    "user_id": "user-uuid",
    "views_count": 0,
    "likes_count": 0,
    "comments_count": 0,
    "created_at": "2023-10-07T12:00:00.000Z"
  },
  "message": "Video uploaded successfully"
}
\`\`\`

### DELETE /api/videos/:id
Delete a video.

**Headers:**
- Authorization: Bearer <user-id>

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Video deleted successfully"
}
\`\`\`

## Interaction Endpoints

### POST /api/videos/:id/like
Like or unlike a video.

**Headers:**
- Authorization: Bearer <user-id>

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "liked": true
  },
  "message": "Video liked successfully"
}
\`\`\`

### GET /api/videos/:id/comments
Get comments for a video.

**Query Parameters:**
- page (optional, default: 1) - Page number
- limit (optional, default: 10) - Number of comments per page

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "uuid",
        "text": "Great video!",
        "created_at": "2023-10-07T12:00:00.000Z",
        "user_id": "user-uuid",
        "user": {
          "username": "jane_doe",
          "avatar": "https://ik.imagekit.io/..."
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  },
  "message": "Comments retrieved successfully"
}
\`\`\`

### POST /api/videos/:id/comment
Add a comment to a video.

**Headers:**
- Authorization: Bearer <user-id>

**Body:**
\`\`\`json
{
  "text": "Great video!"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid",
    "text": "Great video!",
    "created_at": "2023-10-07T12:00:00.000Z",
    "user_id": "user-uuid",
    "user": {
      "username": "jane_doe",
      "avatar": "https://ik.imagekit.io/..."
    }
  },
  "message": "Comment added successfully"
}
\`\`\`

## Authentication Endpoints

### GET /api/auth/imagekit
Get ImageKit authentication parameters for video upload.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "token": "imagekit-token",
    "expire": 1696680000,
    "signature": "imagekit-signature"
  },
  "message": "Authentication parameters retrieved successfully"
}
\`\`\`

## Health Endpoint

### GET /api/health
Check if the API is running.

**Response:**
\`\`\`json
{
  "status": "OK",
  "message": "IG-Live Video Backend is running",
  "timestamp": "2023-10-07T12:00:00.000Z"
}
\`\`\`
`;

  fs.writeFileSync("API_DOCS.md", apiDocs);
  console.log("✅ API documentation generated: API_DOCS.md");
}

function generateDatabaseDocs() {
  const dbDocs = `
# Database Schema Documentation

## Videos Table

Stores metadata for uploaded videos.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Video title (optional) |
| description | TEXT | Video description (optional) |
| video_url | TEXT | Public URL of the video on ImageKit |
| thumbnail_url | TEXT | URL of the video thumbnail (optional) |
| user_id | TEXT | ID of the user who uploaded the video |
| views_count | INTEGER | Number of views (default: 0) |
| likes_count | INTEGER | Number of likes (default: 0) |
| comments_count | INTEGER | Number of comments (default: 0) |
| created_at | TIMESTAMP | When the video was uploaded |
| updated_at | TIMESTAMP | When the video was last updated |

## Video Likes Table

Tracks which users have liked which videos.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| video_id | UUID | Foreign key to videos table |
| user_id | TEXT | ID of the user who liked the video |
| created_at | TIMESTAMP | When the like was created |

## Video Comments Table

Stores comments on videos.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| video_id | UUID | Foreign key to videos table |
| user_id | TEXT | ID of the user who made the comment |
| text | TEXT | The comment text |
| created_at | TIMESTAMP | When the comment was created |

## Functions

### increment_video_views(video_id UUID)
Increments the views_count for a video.

### increment_video_likes(video_id UUID)
Increments the likes_count for a video.

### decrement_video_likes(video_id UUID)
Decrements the likes_count for a video (but not below 0).

### increment_video_comments(video_id UUID)
Increments the comments_count for a video.
`;

  fs.writeFileSync("DATABASE_DOCS.md", dbDocs);
  console.log("✅ Database documentation generated: DATABASE_DOCS.md");
}

function generateAllDocs() {
  console.log("IG-Live Documentation Generator");
  console.log("=============================");

  generateAPIDocs();
  generateDatabaseDocs();

  console.log("\n🎉 All documentation generated successfully!");
}

generateAllDocs();
