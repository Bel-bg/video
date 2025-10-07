// securityDemo.js
// This script demonstrates API security features

const videoApi = require("./src/api/videoApi");

// Security utilities
class SecurityManager {
  static sanitizeInput(input) {
    if (typeof input !== "string") return input;

    // Remove potentially dangerous characters
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  static validateUserId(userId) {
    if (!userId || typeof userId !== "string" || userId.length > 100) {
      throw new Error("Invalid user ID");
    }
    return true;
  }

  static validateVideoId(videoId) {
    if (
      !videoId ||
      typeof videoId !== "string" ||
      !videoId.match(/^[a-zA-Z0-9-_]+$/)
    ) {
      throw new Error("Invalid video ID format");
    }
    return true;
  }

  static rateLimitKey(userId, operation) {
    return `${userId}:${operation}:${Math.floor(Date.now() / 60000)}`; // Per minute
  }
}

// Secure API wrapper
class SecureApi {
  constructor() {
    this.rateLimits = new Map();
    this.maxRequestsPerMinute = 10;
  }

  checkRateLimit(userId, operation) {
    const key = SecurityManager.rateLimitKey(userId, operation);
    const current = this.rateLimits.get(key) || 0;

    if (current >= this.maxRequestsPerMinute) {
      throw new Error(`Rate limit exceeded for ${operation}`);
    }

    this.rateLimits.set(key, current + 1);

    // Clean up old rate limit entries
    if (this.rateLimits.size > 1000) {
      const now = Math.floor(Date.now() / 60000);
      for (const [key] of this.rateLimits) {
        const keyTime = parseInt(key.split(":")[2]);
        if (now - keyTime > 5) {
          // Remove entries older than 5 minutes
          this.rateLimits.delete(key);
        }
      }
    }
  }

  async getVideoFeed(userId, limit = 10) {
    SecurityManager.validateUserId(userId);
    this.checkRateLimit(userId, "getVideoFeed");

    const sanitizedLimit = Math.min(Math.max(limit, 1), 50); // 1-50 range
    return await videoApi.getVideoFeed(sanitizedLimit);
  }

  async getVideo(userId, videoId) {
    SecurityManager.validateUserId(userId);
    SecurityManager.validateVideoId(videoId);
    this.checkRateLimit(userId, "getVideo");

    return await videoApi.getVideo(videoId);
  }

  async likeVideo(userId, videoId) {
    SecurityManager.validateUserId(userId);
    SecurityManager.validateVideoId(videoId);
    this.checkRateLimit(userId, "likeVideo");

    return await videoApi.likeVideo(videoId);
  }

  async commentOnVideo(userId, videoId, text) {
    SecurityManager.validateUserId(userId);
    SecurityManager.validateVideoId(videoId);

    if (!text || typeof text !== "string" || text.length > 1000) {
      throw new Error("Invalid comment text");
    }

    this.checkRateLimit(userId, "commentOnVideo");

    // Sanitize comment text
    const sanitizedText = SecurityManager.sanitizeInput(text);
    return await videoApi.commentOnVideo(videoId, sanitizedText);
  }

  async uploadVideo(userId, videoData) {
    SecurityManager.validateUserId(userId);
    this.checkRateLimit(userId, "uploadVideo");

    // Validate video data
    if (!videoData || typeof videoData !== "object") {
      throw new Error("Invalid video data");
    }

    if (!videoData.video_url || typeof videoData.video_url !== "string") {
      throw new Error("Video URL is required");
    }

    // Sanitize title and description
    const sanitizedData = {
      ...videoData,
      title: videoData.title
        ? SecurityManager.sanitizeInput(videoData.title)
        : null,
      description: videoData.description
        ? SecurityManager.sanitizeInput(videoData.description)
        : null,
    };

    return await videoApi.uploadVideo(sanitizedData);
  }
}

async function securityDemo() {
  try {
    console.log("IG-Live Security Demo");
    console.log("===================");

    const secureApi = new SecureApi();
    const userId = "user-123"; // Mock user ID

    // 1. Valid operations
    console.log("\n1. Valid operations:");

    // Get video feed
    console.log("\n  Getting video feed...");
    const feed = await secureApi.getVideoFeed(userId, 3);
    console.log(`  Retrieved ${feed.length} videos`);

    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`  Using video ID: ${videoId}`);

      // Get video
      console.log("\n  Getting video...");
      const video = await secureApi.getVideo(userId, videoId);
      console.log(`  Retrieved video: ${video.title}`);

      // Like video
      console.log("\n  Liking video...");
      const likeResult = await secureApi.likeVideo(userId, videoId);
      console.log(`  Video ${likeResult.liked ? "liked" : "unliked"}`);

      // Add comment with special characters
      console.log("\n  Adding comment with special characters...");
      const commentText =
        'Security demo comment with <script>alert("xss")</script> and "quotes"';
      const commentResult = await secureApi.commentOnVideo(
        userId,
        videoId,
        commentText
      );
      console.log(`  Comment added (sanitized): ${commentResult.text}`);

      // Upload video with special characters
      console.log("\n  Uploading video with special characters...");
      const uploadData = {
        title: "Security Demo <Video>",
        description: 'Uploaded with "special" characters & symbols',
        video_url: "https://example.com/security-demo.mp4",
      };
      const uploadResult = await secureApi.uploadVideo(userId, uploadData);
      console.log(`  Video uploaded: ${uploadResult.title}`);
    }

    // 2. Invalid operations
    console.log("\n2. Invalid operations (should be blocked):");

    // Invalid user ID
    console.log("\n  Trying with invalid user ID...");
    try {
      await secureApi.getVideoFeed("", 3);
      console.log("  ❌ Should have been blocked");
    } catch (error) {
      console.log(`  ✓ Correctly blocked: ${error.message}`);
    }

    // Invalid video ID
    console.log("\n  Trying with invalid video ID...");
    try {
      await secureApi.getVideo(userId, "<script>");
      console.log("  ❌ Should have been blocked");
    } catch (error) {
      console.log(`  ✓ Correctly blocked: ${error.message}`);
    }

    // Too long comment
    console.log("\n  Trying with too long comment...");
    try {
      const longComment = "x".repeat(2000);
      await secureApi.commentOnVideo(userId, feed[0].id, longComment);
      console.log("  ❌ Should have been blocked");
    } catch (error) {
      console.log(`  ✓ Correctly blocked: ${error.message}`);
    }

    // 3. Rate limiting
    console.log("\n3. Testing rate limiting...");

    // Make many requests quickly to trigger rate limiting
    console.log("  Making rapid requests...");
    let rateLimitHit = false;

    for (let i = 1; i <= 15; i++) {
      // More than the limit of 10
      try {
        await secureApi.getVideoFeed(userId, 1);
        console.log(`    Request ${i}: Success`);
      } catch (error) {
        if (error.message.includes("Rate limit")) {
          console.log(`    Request ${i}: ✓ Rate limited as expected`);
          rateLimitHit = true;
          break;
        } else {
          console.log(`    Request ${i}: Error - ${error.message}`);
        }
      }
    }

    if (rateLimitHit) {
      console.log("  ✓ Rate limiting is working");
    } else {
      console.log("  ❌ Rate limiting may not be working");
    }

    console.log("\n🎉 Security demo completed successfully!");
  } catch (error) {
    console.error("❌ Security demo failed:", error.message);
  }
}

securityDemo();
