// offlineDemo.js
// This script demonstrates API with offline support

const videoApi = require("./src/api/videoApi");

// Simple offline storage using localStorage simulation
class OfflineStorage {
  constructor() {
    this.storage = new Map();
  }

  setItem(key, value) {
    this.storage.set(key, JSON.stringify(value));
    console.log(`💾 Stored ${key} in offline storage`);
  }

  getItem(key) {
    const item = this.storage.get(key);
    return item ? JSON.parse(item) : null;
  }

  removeItem(key) {
    this.storage.delete(key);
    console.log(`🗑️ Removed ${key} from offline storage`);
  }

  clear() {
    this.storage.clear();
    console.log("🧹 Cleared offline storage");
  }

  getAllKeys() {
    return Array.from(this.storage.keys());
  }
}

// Offline-aware API wrapper
class OfflineApi {
  constructor() {
    this.storage = new OfflineStorage();
    this.isOnline = true;
    this.pendingActions = [];
  }

  setOnlineStatus(online) {
    this.isOnline = online;
    console.log(`🌐 Network status: ${online ? "ONLINE" : "OFFLINE"}`);

    // Process pending actions when coming back online
    if (online && this.pendingActions.length > 0) {
      console.log(
        `🔁 Processing ${this.pendingActions.length} pending actions...`
      );
      this.processPendingActions();
    }
  }

  async processPendingActions() {
    const actions = [...this.pendingActions];
    this.pendingActions = [];

    for (const action of actions) {
      try {
        console.log(`  Processing pending action: ${action.type}`);
        await action.execute();
        console.log(`  ✓ Completed pending action: ${action.type}`);
      } catch (error) {
        console.log(
          `  ✗ Failed pending action: ${action.type} - ${error.message}`
        );
        // Re-add to pending actions if still failing
        this.pendingActions.push(action);
      }
    }
  }

  async getVideoFeed(limit = 10) {
    if (this.isOnline) {
      try {
        console.log("📡 Fetching video feed from API");
        const feed = await videoApi.getVideoFeed(limit);

        // Cache the feed for offline use
        this.storage.setItem("videoFeed", {
          data: feed,
          timestamp: Date.now(),
          limit: limit,
        });

        return feed;
      } catch (error) {
        console.log(`⚠️ API failed, checking offline cache: ${error.message}`);
        const cached = this.storage.getItem("videoFeed");
        if (cached) {
          console.log("📱 Using cached video feed");
          return cached.data;
        }
        throw error;
      }
    } else {
      console.log("📱 Offline mode: using cached video feed");
      const cached = this.storage.getItem("videoFeed");
      if (cached) {
        return cached.data;
      }
      throw new Error("No cached data available and offline");
    }
  }

  async getVideo(videoId) {
    if (this.isOnline) {
      try {
        console.log(`📡 Fetching video ${videoId} from API`);
        const video = await videoApi.getVideo(videoId);

        // Cache the video for offline use
        this.storage.setItem(`video_${videoId}`, {
          data: video,
          timestamp: Date.now(),
        });

        return video;
      } catch (error) {
        console.log(`⚠️ API failed, checking offline cache: ${error.message}`);
        const cached = this.storage.getItem(`video_${videoId}`);
        if (cached) {
          console.log(`📱 Using cached video ${videoId}`);
          return cached.data;
        }
        throw error;
      }
    } else {
      console.log(`📱 Offline mode: using cached video ${videoId}`);
      const cached = this.storage.getItem(`video_${videoId}`);
      if (cached) {
        return cached.data;
      }
      throw new Error(`No cached data for video ${videoId} and offline`);
    }
  }

  async likeVideo(videoId) {
    if (this.isOnline) {
      try {
        console.log(`📡 Liking video ${videoId} via API`);
        const result = await videoApi.likeVideo(videoId);

        // Update cached video
        const cachedVideo = this.storage.getItem(`video_${videoId}`);
        if (cachedVideo) {
          cachedVideo.data.likes_count = result.liked
            ? (cachedVideo.data.likes_count || 0) + 1
            : Math.max(0, (cachedVideo.data.likes_count || 0) - 1);
          this.storage.setItem(`video_${videoId}`, cachedVideo);
        }

        return result;
      } catch (error) {
        console.log(`⚠️ API failed, queuing like action: ${error.message}`);
        // Queue action for later
        this.pendingActions.push({
          type: "like",
          videoId,
          execute: () => this.likeVideo(videoId),
        });
        throw error;
      }
    } else {
      console.log(`📱 Offline mode: queuing like action for video ${videoId}`);
      // Queue action for later
      this.pendingActions.push({
        type: "like",
        videoId,
        execute: () => this.likeVideo(videoId),
      });
      throw new Error("Offline: action queued for later");
    }
  }

  async commentOnVideo(videoId, text) {
    if (this.isOnline) {
      try {
        console.log(`📡 Adding comment to video ${videoId} via API`);
        const result = await videoApi.commentOnVideo(videoId, text);

        // Update cached video comments count
        const cachedVideo = this.storage.getItem(`video_${videoId}`);
        if (cachedVideo) {
          cachedVideo.data.comments_count =
            (cachedVideo.data.comments_count || 0) + 1;
          this.storage.setItem(`video_${videoId}`, cachedVideo);
        }

        return result;
      } catch (error) {
        console.log(`⚠️ API failed, queuing comment action: ${error.message}`);
        // Queue action for later
        this.pendingActions.push({
          type: "comment",
          videoId,
          text,
          execute: () => this.commentOnVideo(videoId, text),
        });
        throw error;
      }
    } else {
      console.log(
        `📱 Offline mode: queuing comment action for video ${videoId}`
      );
      // Queue action for later
      this.pendingActions.push({
        type: "comment",
        videoId,
        text,
        execute: () => this.commentOnVideo(videoId, text),
      });
      throw new Error("Offline: action queued for later");
    }
  }

  async uploadVideo(videoData) {
    if (this.isOnline) {
      try {
        console.log("📡 Uploading video via API");
        const result = await videoApi.uploadVideo(videoData);
        return result;
      } catch (error) {
        console.log(`⚠️ API failed, queuing upload action: ${error.message}`);
        // Queue action for later
        this.pendingActions.push({
          type: "upload",
          videoData,
          execute: () => this.uploadVideo(videoData),
        });
        throw error;
      }
    } else {
      console.log("📱 Offline mode: queuing upload action");
      // Queue action for later
      this.pendingActions.push({
        type: "upload",
        videoData,
        execute: () => this.uploadVideo(videoData),
      });
      throw new Error("Offline: action queued for later");
    }
  }

  getPendingActionsCount() {
    return this.pendingActions.length;
  }

  clearOfflineData() {
    this.storage.clear();
    this.pendingActions = [];
    console.log("🧹 Cleared all offline data");
  }
}

async function offlineDemo() {
  try {
    console.log("IG-Live Offline Support Demo");
    console.log("==========================");

    const offlineApi = new OfflineApi();

    // 1. Online mode - fetch and cache data
    console.log("\n1. Online mode - fetching and caching data...");
    const feed = await offlineApi.getVideoFeed(3);
    console.log(`  Retrieved ${feed.length} videos and cached them`);

    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`  Using video ID: ${videoId}`);

      // Get and cache video details
      const video = await offlineApi.getVideo(videoId);
      console.log(`  Retrieved and cached video: ${video.title}`);
    }

    // 2. Go offline
    console.log("\n2. Going offline...");
    offlineApi.setOnlineStatus(false);

    // 3. Access cached data while offline
    console.log("\n3. Accessing cached data while offline...");
    const offlineFeed = await offlineApi.getVideoFeed(3);
    console.log(`  Retrieved ${offlineFeed.length} videos from cache`);

    if (offlineFeed.length > 0) {
      const videoId = offlineFeed[0].id;
      console.log(`  Using video ID: ${videoId}`);

      const offlineVideo = await offlineApi.getVideo(videoId);
      console.log(`  Retrieved video from cache: ${offlineVideo.title}`);
    }

    // 4. Try operations that queue for later
    console.log("\n4. Trying operations that queue for later...");

    if (offlineFeed.length > 0) {
      const videoId = offlineFeed[0].id;

      // Like video (should queue)
      console.log("\n  Liking video (should queue)...");
      try {
        await offlineApi.likeVideo(videoId);
      } catch (error) {
        console.log(`  ✓ Action queued: ${error.message}`);
      }

      // Add comment (should queue)
      console.log("\n  Adding comment (should queue)...");
      try {
        await offlineApi.commentOnVideo(videoId, "Offline demo comment");
      } catch (error) {
        console.log(`  ✓ Action queued: ${error.message}`);
      }
    }

    // Upload video (should queue)
    console.log("\n  Uploading video (should queue)...");
    try {
      const uploadData = {
        title: "Offline Demo Video",
        description: "Uploaded while offline",
        video_url: "https://example.com/offline-demo.mp4",
      };
      await offlineApi.uploadVideo(uploadData);
    } catch (error) {
      console.log(`  ✓ Action queued: ${error.message}`);
    }

    // Show pending actions
    console.log(`\n  Pending actions: ${offlineApi.getPendingActionsCount()}`);

    // 5. Go back online and process pending actions
    console.log("\n5. Going back online and processing pending actions...");
    offlineApi.setOnlineStatus(true);

    // Wait a moment for pending actions to process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(
      `  Remaining pending actions: ${offlineApi.getPendingActionsCount()}`
    );

    // 6. Clear offline data
    console.log("\n6. Clearing offline data...");
    offlineApi.clearOfflineData();

    console.log("\n🎉 Offline support demo completed successfully!");
  } catch (error) {
    console.error("❌ Offline support demo failed:", error.message);
  }
}

offlineDemo();
