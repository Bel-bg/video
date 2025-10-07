# Database Schema Documentation

## Videos Table

Stores metadata for uploaded videos.

| Column         | Type      | Description                           |
| -------------- | --------- | ------------------------------------- |
| id             | UUID      | Primary key                           |
| title          | TEXT      | Video title (optional)                |
| description    | TEXT      | Video description (optional)          |
| video_url      | TEXT      | Public URL of the video on ImageKit   |
| thumbnail_url  | TEXT      | URL of the video thumbnail (optional) |
| user_id        | TEXT      | ID of the user who uploaded the video |
| views_count    | INTEGER   | Number of views (default: 0)          |
| likes_count    | INTEGER   | Number of likes (default: 0)          |
| comments_count | INTEGER   | Number of comments (default: 0)       |
| created_at     | TIMESTAMP | When the video was uploaded           |
| updated_at     | TIMESTAMP | When the video was last updated       |

## Video Likes Table

Tracks which users have liked which videos.

| Column     | Type      | Description                        |
| ---------- | --------- | ---------------------------------- |
| id         | UUID      | Primary key                        |
| video_id   | UUID      | Foreign key to videos table        |
| user_id    | TEXT      | ID of the user who liked the video |
| created_at | TIMESTAMP | When the like was created          |

## Video Comments Table

Stores comments on videos.

| Column     | Type      | Description                         |
| ---------- | --------- | ----------------------------------- |
| id         | UUID      | Primary key                         |
| video_id   | UUID      | Foreign key to videos table         |
| user_id    | TEXT      | ID of the user who made the comment |
| text       | TEXT      | The comment text                    |
| created_at | TIMESTAMP | When the comment was created        |

## Functions

### increment_video_views(video_id UUID)

Increments the views_count for a video.

### increment_video_likes(video_id UUID)

Increments the likes_count for a video.

### decrement_video_likes(video_id UUID)

Decrements the likes_count for a video (but not below 0).

### increment_video_comments(video_id UUID)

Increments the comments_count for a video.
