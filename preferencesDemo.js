// preferencesDemo.js
// This script demonstrates API with user preferences

const videoApi = require("./src/api/videoApi");

// User preferences manager
class PreferencesManager {
  constructor() {
    this.preferences = {
      videoQuality: "auto", // 'low', 'medium', 'high', 'auto'
      autoplay: true,
      captions: false,
      captionsLanguage: "en",
      notifications: true,
      darkMode: false,
      feedSortOrder: "newest", // 'newest', 'popular', 'trending'
      videoFeedLimit: 10,
      commentSortOrder: "newest", // 'newest', 'oldest', 'popular'
    };
  }

  get(key) {
    return this.preferences[key];
  }

  set(key, value) {
    if (key in this.preferences) {
      this.preferences[key] = value;
      console.log(`🔧 Preference updated: ${key} = ${value}`);
      return true;
    }
    return false;
  }

  getAll() {
    return { ...this.preferences };
  }

  reset() {
    this.preferences = {
      videoQuality: "auto",
      autoplay: true,
      captions: false,
      captionsLanguage: "en",
      notifications: true,
      darkMode: false,
      feedSortOrder: "newest",
      videoFeedLimit: 10,
      commentSortOrder: "newest",
    };
    console.log("🔧 All preferences reset to defaults");
  }
}

// Preferences-aware API wrapper
class PreferencesApi {
  constructor() {
    this.preferences = new PreferencesManager();
  }

  setPreference(key, value) {
    return this.preferences.set(key, value);
  }

  getPreference(key) {
    return this.preferences.get(key);
  }

  getAllPreferences() {
    return this.preferences.getAll();
  }

  async getVideoFeed(limit = null) {
    // Use preference for limit if not specified
    const feedLimit = limit || this.preferences.get("videoFeedLimit");

    // In a real implementation, you might also sort based on preferences
    const sortOrder = this.preferences.get("feedSortOrder");
    console.log(
      `📱 Getting video feed with limit ${feedLimit}, sorted by ${sortOrder}`
    );

    const feed = await videoApi.getVideoFeed(feedLimit);

    // Apply sorting based on preferences
    switch (sortOrder) {
      case "popular":
        // Sort by likes count (descending)
        return feed.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
      case "trending":
        // Sort by views count (descending)
        return feed.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
      case "newest":
      default:
        // Feed is already sorted by newest (created_at DESC)
        return feed;
    }
  }

  async getVideo(videoId) {
    console.log(`📱 Getting video with user preferences applied`);
    const video = await videoApi.getVideo(videoId);

    // Apply user preferences to video data
    video.preferredQuality = this.preferences.get("videoQuality");
    video.autoplay = this.preferences.get("autoplay");
    video.showCaptions = this.preferences.get("captions");
    video.captionsLanguage = this.preferences.get("captionsLanguage");

    return video;
  }

  async getVideoComments(videoId, page = 1, limit = 10) {
    console.log(`📱 Getting video comments with user preferences`);
    const commentsData = await videoApi.getVideoComments(videoId, page, limit);

    // Apply comment sorting preference
    const sortOrder = this.preferences.get("commentSortOrder");
    console.log(`  Sorting comments by ${sortOrder}`);

    switch (sortOrder) {
      case "oldest":
        // Sort by created_at ascending (oldest first)
        commentsData.comments.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        break;
      case "popular":
        // Sort by likes count descending (popular first)
        // Note: Our demo data doesn't include likes on comments
        break;
      case "newest":
      default:
        // Comments are already sorted by newest (created_at DESC)
        break;
    }

    return commentsData;
  }

  async uploadVideo(videoData) {
    console.log(`📱 Uploading video with user context`);

    // Add user preferences context to upload
    videoData.uploadContext = {
      darkMode: this.preferences.get("darkMode"),
      notifications: this.preferences.get("notifications"),
    };

    return await videoApi.uploadVideo(videoData);
  }
}

async function preferencesDemo() {
  try {
    console.log("IG-Live User Preferences Demo");
    console.log("===========================");

    const preferencesApi = new PreferencesApi();

    // 1. Show default preferences
    console.log("\n1. Default user preferences:");
    const defaultPrefs = preferencesApi.getAllPreferences();
    for (const [key, value] of Object.entries(defaultPrefs)) {
      console.log(`  ${key}: ${value}`);
    }

    // 2. Update some preferences
    console.log("\n2. Updating user preferences...");
    preferencesApi.setPreference("videoFeedLimit", 5);
    preferencesApi.setPreference("feedSortOrder", "popular");
    preferencesApi.setPreference("captions", true);
    preferencesApi.setPreference("captionsLanguage", "fr");

    // 3. Get video feed with preferences
    console.log("\n3. Getting video feed with updated preferences...");
    const feed = await preferencesApi.getVideoFeed();
    console.log(`  Retrieved ${feed.length} videos sorted by popularity`);

    // Show first few videos with their like counts
    feed.slice(0, 3).forEach((video, index) => {
      console.log(
        `    ${index + 1}. ${video.title} (${video.likes_count || 0} likes)`
      );
    });

    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`\n  Using video ID: ${videoId}`);

      // 4. Get video with preferences
      console.log("\n4. Getting video with user preferences...");
      const video = await preferencesApi.getVideo(videoId);
      console.log(`  Video: ${video.title}`);
      console.log(`  Preferred quality: ${video.preferredQuality}`);
      console.log(`  Autoplay: ${video.autoplay}`);
      console.log(`  Show captions: ${video.showCaptions}`);
      console.log(`  Captions language: ${video.captionsLanguage}`);

      // 5. Get comments with sorting preference
      console.log("\n5. Updating comment sorting preference...");
      preferencesApi.setPreference("commentSortOrder", "oldest");

      console.log("\n6. Getting comments sorted by oldest...");
      const commentsData = await preferencesApi.getVideoComments(videoId, 1, 5);
      console.log(`  Retrieved ${commentsData.comments.length} comments`);

      // Show comment timestamps
      commentsData.comments.forEach((comment, index) => {
        console.log(
          `    ${index + 1}. ${comment.text} (at ${comment.created_at})`
        );
      });
    }

    // 6. Upload video with preferences context
    console.log("\n7. Uploading video with user preferences context...");
    const uploadData = {
      title: "Preferences Demo Video",
      description: "Uploaded with user preferences context",
      video_url: "https://example.com/preferences-demo.mp4",
    };
    const uploadResult = await preferencesApi.uploadVideo(uploadData);
    console.log(`  Video uploaded with ID: ${uploadResult.id}`);
    console.log(
      `  Upload context included: darkMode=${uploadData.uploadContext.darkMode}, notifications=${uploadData.uploadContext.notifications}`
    );

    // 7. Reset preferences
    console.log("\n8. Resetting preferences to defaults...");
    preferencesApi.preferences.reset();

    const resetPrefs = preferencesApi.getAllPreferences();
    console.log("  Reset preferences:");
    for (const [key, value] of Object.entries(resetPrefs)) {
      console.log(`    ${key}: ${value}`);
    }

    console.log("\n🎉 User preferences demo completed successfully!");
  } catch (error) {
    console.error("❌ User preferences demo failed:", error.message);
  }
}

preferencesDemo();
