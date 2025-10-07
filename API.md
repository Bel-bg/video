# API Documentation

## Health Check

### GET /api/health

Checks if the API is running correctly.

**Response:**

```json
{
  "status": "OK",
  "message": "IG-Live Video Backend is running",
  "timestamp": "2023-10-07T12:00:00.000Z"
}
```

## Videos

### GET /api/videos/feed

Get a feed of videos.

**Query Parameters:**

- `limit` (optional, default: 10) - Number of videos to return

**Response:**

```json
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
```

### GET /api/videos/:id

Get a specific video by ID.

**Response:**

```json
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
```

### POST /api/videos

Upload a new video.

**Headers:**

- `Authorization: Bearer <user-id>`

**Body:**

```json
{
  "title": "Video Title",
  "description": "Video Description",
  "video_url": "https://ik.imagekit.io/...",
  "thumbnail_url": "https://ik.imagekit.io/..."
}
```

**Response:**

```json
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
```

### DELETE /api/videos/:id

Delete a video.

**Headers:**

- `Authorization: Bearer <user-id>`

**Response:**

```json
{
  "success": true,
  "message": "Video deleted successfully"
}
```

## Interactions

### POST /api/videos/:id/like

Like or unlike a video.

**Headers:**

- `Authorization: Bearer <user-id>`

**Response:**

```json
{
  "success": true,
  "data": {
    "liked": true
  },
  "message": "Video liked successfully"
}
```

### GET /api/videos/:id/comments

Get comments for a video.

**Query Parameters:**

- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Number of comments per page

**Response:**

```json
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
```

### POST /api/videos/:id/comment

Add a comment to a video.

**Headers:**

- `Authorization: Bearer <user-id>`

**Body:**

```json
{
  "text": "Great video!"
}
```

**Response:**

```json
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
```

## Authentication

### GET /api/auth/imagekit

Get ImageKit authentication parameters for video upload.

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "imagekit-token",
    "expire": 1696680000,
    "signature": "imagekit-signature"
  },
  "message": "Authentication parameters retrieved successfully"
}
```
