// comprehensiveDemo.js
// This script demonstrates all API features combined

const videoApi = require("./src/api/videoApi");

// Import all our utility classes
const { SimpleCache } = require("./cachingDemo");
const { Logger } = require("./loggingDemo");
const { ConfigManager } = require("./configDemo");
const { Validator } = require("./validationDemo");
const { RateLimiter } = require("./rateLimitingDemo");
const { RetryHandler } = require("./retryDemo");
const { TimeoutHandler } = require("./timeoutDemo");

// Initialize utilities
const cache = new SimpleCache();
const logger = new Logger("debug");
const config = new ConfigManager();
const rateLimiter = new RateLimiter(5, 1000);

// Comprehensive API wrapper with all features
class ComprehensiveApi {
  constructor() {
    this.cache = cache;
    this.logger = logger;
    this.config = config;
    this.rateLimiter = rateLimiter;
  }

  async getVideoFeed(limit = 10) {
    this.logger.info("Getting video feed", { limit });

    // Check cache first
    const cacheKey = `videoFeed_${limit}`;
    let feed = this.cache.get(cacheKey);

    if (feed && this.config.get("features.enableCaching")) {
      this.logger.info("Cache hit for video feed");
      return feed;
    }

    // Apply rate limiting
    feed = await this.rateLimiter.execute(async () => {
      // Apply timeout
      const timeout = this.config.get("api.timeout");
      return await TimeoutHandler.execute(
        () =>
          RetryHandler.execute(
            () => videoApi.getVideoFeed(limit),
            this.config.get("api.retries")
          ),
        timeout
      );
    });

    // Cache result
    if (this.config.get("features.enableCaching")) {
      this.cache.set(cacheKey, feed, 5 * 60 * 1000); // 5 minutes
      this.logger.info("Cached video feed");
    }

    return feed;
  }

  async getVideo(videoId) {
    Validator.validateVideoId(videoId);
    this.logger.info("Getting video", { videoId });

    // Check cache first
    const cacheKey = `video_${videoId}`;
    let video = this.cache.get(cacheKey);

    if (video && this.config.get("features.enableCaching")) {
      this.logger.info("Cache hit for video");
      return video;
    }

    // Apply rate limiting
    video = await this.rateLimiter.execute(async () => {
      // Apply timeout
      const timeout = this.config.get("api.timeout");
      return await TimeoutHandler.execute(
        () =>
          RetryHandler.execute(
            () => videoApi.getVideo(videoId),
            this.config.get("api.retries")
          ),
        timeout
      );
    });

    // Cache result
    if (this.config.get("features.enableCaching")) {
      this.cache.set(cacheKey, video, 2 * 60 * 1000); // 2 minutes
      this.logger.info("Cached video");
    }

    return video;
  }

  async likeVideo(videoId) {
    Validator.validateVideoId(videoId);
    this.logger.info("Liking video", { videoId });

    // Apply rate limiting
    return await this.rateLimiter.execute(async () => {
      // Apply timeout
      const timeout = this.config.get("api.timeout");
      return await TimeoutHandler.execute(
        () =>
          RetryHandler.execute(
            () => videoApi.likeVideo(videoId),
            this.config.get("api.retries")
          ),
        timeout
      );
    });
  }

  async commentOnVideo(videoId, text) {
    Validator.validateVideoId(videoId);
    Validator.validateCommentText(text);
    this.logger.info("Adding comment", { videoId, textLength: text.length });

    // Apply rate limiting
    return await this.rateLimiter.execute(async () => {
      // Apply timeout
      const timeout = this.config.get("api.timeout");
      return await TimeoutHandler.execute(
        () =>
          RetryHandler.execute(
            () => videoApi.commentOnVideo(videoId, text),
            this.config.get("api.retries")
          ),
        timeout
      );
    });
  }

  async uploadVideo(videoData) {
    Validator.validateVideoData(videoData);
    this.logger.info("Uploading video", { title: videoData.title });

    // Apply rate limiting
    return await this.rateLimiter.execute(async () => {
      // Apply timeout
      const timeout = this.config.get("api.timeout");
      return await TimeoutHandler.execute(
        () =>
          RetryHandler.execute(
            () => videoApi.uploadVideo(videoData),
            this.config.get("api.retries")
          ),
        timeout
      );
    });
  }
}

async function comprehensiveDemo() {
  try {
    console.log("IG-Live Comprehensive Demo");
    console.log("========================");

    // Initialize comprehensive API
    const api = new ComprehensiveApi();

    // 1. Get video feed
    console.log("\n1. Getting video feed...");
    const feed = await api.getVideoFeed(3);
    console.log(`✓ Retrieved ${feed.length} videos`);

    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`\nUsing video ID: ${videoId}`);

      // 2. Get video details
      console.log("\n2. Getting video details...");
      const video = await api.getVideo(videoId);
      console.log(`✓ Retrieved video: ${video.title}`);

      // 3. Like video
      console.log("\n3. Liking video...");
      const likeResult = await api.likeVideo(videoId);
      console.log(`✓ Video ${likeResult.liked ? "liked" : "unliked"}`);

      // 4. Add comment
      console.log("\n4. Adding comment...");
      const commentResult = await api.commentOnVideo(
        videoId,
        "Comprehensive demo comment"
      );
      console.log(`✓ Comment added with ID: ${commentResult.id}`);

      // 5. Upload video
      console.log("\n5. Uploading video...");
      const uploadData = {
        title: "Comprehensive Demo Video",
        description: "Uploaded with all features",
        video_url: "https://example.com/comprehensive-demo.mp4",
      };
      const uploadResult = await api.uploadVideo(uploadData);
      console.log(`✓ Video uploaded with ID: ${uploadResult.id}`);

      // 6. Show cache status
      console.log("\n6. Cache status:");
      console.log(`  Cached items: ${api.cache.cache.size}`);

      // 7. Second request to same video (should hit cache)
      console.log("\n7. Getting same video again (should hit cache)...");
      const videoAgain = await api.getVideo(videoId);
      console.log(`✓ Retrieved video: ${videoAgain.title}`);
    }

    console.log("\n🎉 Comprehensive demo completed successfully!");
  } catch (error) {
    console.error("❌ Comprehensive demo failed:", error.message);
  }
}

comprehensiveDemo();
