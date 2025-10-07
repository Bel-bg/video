// analyticsDemo.js
// This script demonstrates API analytics

const videoApi = require("./src/api/videoApi");

// Analytics collector
class AnalyticsCollector {
  constructor() {
    this.events = [];
    this.sessionStart = Date.now();
  }

  trackEvent(eventName, properties = {}) {
    const event = {
      name: eventName,
      timestamp: new Date().toISOString(),
      properties: {
        ...properties,
        sessionId: this.sessionStart,
      },
    };

    this.events.push(event);
    console.log(`📊 Tracked event: ${eventName}`, properties);
  }

  getSummary() {
    const duration = Date.now() - this.sessionStart;
    const eventCounts = {};

    this.events.forEach((event) => {
      eventCounts[event.name] = (eventCounts[event.name] || 0) + 1;
    });

    return {
      sessionDuration: duration,
      totalEvents: this.events.length,
      eventCounts,
      mostCommonEvent: Object.keys(eventCounts).reduce(
        (a, b) => (eventCounts[a] > eventCounts[b] ? a : b),
        Object.keys(eventCounts)[0]
      ),
    };
  }

  exportData() {
    return {
      sessionStart: this.sessionStart,
      sessionEnd: Date.now(),
      events: this.events,
    };
  }
}

// Analytics-enhanced API wrapper
class AnalyticsApi {
  constructor() {
    this.analytics = new AnalyticsCollector();
  }

  async getVideoFeed(limit = 10) {
    this.analytics.trackEvent("video_feed_requested", { limit });
    const start = Date.now();

    try {
      const feed = await videoApi.getVideoFeed(limit);
      const duration = Date.now() - start;

      this.analytics.trackEvent("video_feed_received", {
        videoCount: feed.length,
        durationMs: duration,
        success: true,
      });

      return feed;
    } catch (error) {
      const duration = Date.now() - start;
      this.analytics.trackEvent("video_feed_failed", {
        durationMs: duration,
        error: error.message,
        success: false,
      });
      throw error;
    }
  }

  async getVideo(videoId) {
    this.analytics.trackEvent("video_requested", { videoId });
    const start = Date.now();

    try {
      const video = await videoApi.getVideo(videoId);
      const duration = Date.now() - start;

      this.analytics.trackEvent("video_received", {
        videoId,
        durationMs: duration,
        success: true,
      });

      return video;
    } catch (error) {
      const duration = Date.now() - start;
      this.analytics.trackEvent("video_failed", {
        videoId,
        durationMs: duration,
        error: error.message,
        success: false,
      });
      throw error;
    }
  }

  async likeVideo(videoId) {
    this.analytics.trackEvent("video_like_requested", { videoId });
    const start = Date.now();

    try {
      const result = await videoApi.likeVideo(videoId);
      const duration = Date.now() - start;

      this.analytics.trackEvent("video_like_completed", {
        videoId,
        liked: result.liked,
        durationMs: duration,
        success: true,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.analytics.trackEvent("video_like_failed", {
        videoId,
        durationMs: duration,
        error: error.message,
        success: false,
      });
      throw error;
    }
  }

  async commentOnVideo(videoId, text) {
    this.analytics.trackEvent("video_comment_requested", {
      videoId,
      commentLength: text.length,
    });
    const start = Date.now();

    try {
      const result = await videoApi.commentOnVideo(videoId, text);
      const duration = Date.now() - start;

      this.analytics.trackEvent("video_comment_completed", {
        videoId,
        commentId: result.id,
        commentLength: text.length,
        durationMs: duration,
        success: true,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.analytics.trackEvent("video_comment_failed", {
        videoId,
        commentLength: text.length,
        durationMs: duration,
        error: error.message,
        success: false,
      });
      throw error;
    }
  }

  async uploadVideo(videoData) {
    this.analytics.trackEvent("video_upload_requested", {
      title: videoData.title,
      hasDescription: !!videoData.description,
      videoUrlLength: videoData.video_url?.length || 0,
    });
    const start = Date.now();

    try {
      const result = await videoApi.uploadVideo(videoData);
      const duration = Date.now() - start;

      this.analytics.trackEvent("video_upload_completed", {
        videoId: result.id,
        title: result.title,
        durationMs: duration,
        success: true,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.analytics.trackEvent("video_upload_failed", {
        title: videoData.title,
        durationMs: duration,
        error: error.message,
        success: false,
      });
      throw error;
    }
  }

  getAnalyticsSummary() {
    return this.analytics.getSummary();
  }

  exportAnalyticsData() {
    return this.analytics.exportData();
  }
}

async function analyticsDemo() {
  try {
    console.log("IG-Live Analytics Demo");
    console.log("====================");

    const analyticsApi = new AnalyticsApi();

    // 1. Perform various operations
    console.log("\n1. Performing operations with analytics tracking...");

    // Get video feed
    console.log("\n  Getting video feed...");
    const feed = await analyticsApi.getVideoFeed(3);
    console.log(`  Retrieved ${feed.length} videos`);

    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`  Using video ID: ${videoId}`);

      // Get video
      console.log("\n  Getting video...");
      const video = await analyticsApi.getVideo(videoId);
      console.log(`  Retrieved video: ${video.title}`);

      // Like video
      console.log("\n  Liking video...");
      const likeResult = await analyticsApi.likeVideo(videoId);
      console.log(`  Video ${likeResult.liked ? "liked" : "unliked"}`);

      // Add comment
      console.log("\n  Adding comment...");
      const commentResult = await analyticsApi.commentOnVideo(
        videoId,
        "Analytics demo comment"
      );
      console.log(`  Comment added with ID: ${commentResult.id}`);

      // Upload video
      console.log("\n  Uploading video...");
      const uploadData = {
        title: "Analytics Demo Video",
        description: "Uploaded with analytics tracking",
        video_url: "https://example.com/analytics-demo.mp4",
      };
      const uploadResult = await analyticsApi.uploadVideo(uploadData);
      console.log(`  Video uploaded with ID: ${uploadResult.id}`);
    }

    // 2. Show analytics summary
    console.log("\n2. Analytics summary:");
    const summary = analyticsApi.getAnalyticsSummary();
    console.log(`  Session duration: ${summary.sessionDuration}ms`);
    console.log(`  Total events tracked: ${summary.totalEvents}`);
    console.log(`  Most common event: ${summary.mostCommonEvent}`);
    console.log("  Event breakdown:");
    for (const [event, count] of Object.entries(summary.eventCounts)) {
      console.log(`    ${event}: ${count}`);
    }

    // 3. Export analytics data
    console.log("\n3. Exporting analytics data...");
    const exportedData = analyticsApi.exportAnalyticsData();
    console.log(`  Exported ${exportedData.events.length} events`);
    console.log(
      `  Session duration: ${
        exportedData.sessionEnd - exportedData.sessionStart
      }ms`
    );

    // Show first few events
    console.log("  First 3 events:");
    exportedData.events.slice(0, 3).forEach((event, index) => {
      console.log(`    ${index + 1}. ${event.name} at ${event.timestamp}`);
    });

    console.log("\n🎉 Analytics demo completed successfully!");
  } catch (error) {
    console.error("❌ Analytics demo failed:", error.message);
  }
}

analyticsDemo();
