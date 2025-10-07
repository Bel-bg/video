// cachingDemo.js
// This script demonstrates API caching strategies

const videoApi = require("./src/api/videoApi");

// Simple in-memory cache
class SimpleCache {
  constructor() {
    this.cache = new Map();
    this.defaultTtl = 5 * 60 * 1000; // 5 minutes
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  set(key, value, ttl = this.defaultTtl) {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl,
    });
  }

  clear() {
    this.cache.clear();
  }
}

const cache = new SimpleCache();

async function cachingDemo() {
  try {
    console.log("IG-Live Caching Demo");
    console.log("==================");

    // 1. Cache video feed
    console.log("\n1. Caching video feed...");
    let feed = cache.get("videoFeed");

    if (!feed) {
      console.log("  Cache miss, fetching from API...");
      feed = await videoApi.getVideoFeed(5);
      cache.set("videoFeed", feed);
      console.log("  Cached video feed");
    } else {
      console.log("  Cache hit, using cached data");
    }

    console.log(`✓ Retrieved ${feed.length} videos`);

    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`Using video ID: ${videoId}`);

      // 2. Cache individual video
      console.log("\n2. Caching individual video...");
      const cacheKey = `video_${videoId}`;
      let video = cache.get(cacheKey);

      if (!video) {
        console.log("  Cache miss, fetching from API...");
        video = await videoApi.getVideo(videoId);
        cache.set(cacheKey, video, 2 * 60 * 1000); // 2 minutes for video details
        console.log("  Cached video details");
      } else {
        console.log("  Cache hit, using cached data");
      }

      console.log(`  Video title: ${video.title}`);

      // 3. Cache comments
      console.log("\n3. Caching comments...");
      const commentsCacheKey = `comments_${videoId}`;
      let comments = cache.get(commentsCacheKey);

      if (!comments) {
        console.log("  Cache miss, fetching from API...");
        comments = await videoApi.getVideoComments(videoId, 1, 10);
        cache.set(commentsCacheKey, comments, 60 * 1000); // 1 minute for comments
        console.log("  Cached comments");
      } else {
        console.log("  Cache hit, using cached data");
      }

      console.log(`  Retrieved ${comments.comments.length} comments`);

      // 4. Show cache status
      console.log("\n4. Cache status:");
      console.log(`  Total cached items: ${cache.cache.size}`);

      // 5. Clear cache and fetch again
      console.log("\n5. Clearing cache and fetching again...");
      cache.clear();
      console.log("  Cache cleared");

      console.log("\n6. Fetching after cache clear...");
      feed = await videoApi.getVideoFeed(3);
      console.log(`  Retrieved ${feed.length} videos (fresh from API)`);
    }

    console.log("\n🎉 Caching demo completed successfully!");
  } catch (error) {
    console.error("❌ Caching demo failed:", error.message);
  }
}

cachingDemo();
