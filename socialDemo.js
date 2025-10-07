// socialDemo.js
// This script demonstrates API with social features

const videoApi = require("./src/api/videoApi");

// Social features manager
class SocialManager {
  constructor() {
    this.following = new Set();
    this.blocked = new Set();
    this.favorites = new Set();
  }

  followUser(userId) {
    if (this.blocked.has(userId)) {
      throw new Error("Cannot follow a blocked user");
    }
    this.following.add(userId);
    console.log(`➕ Followed user ${userId}`);
  }

  unfollowUser(userId) {
    this.following.delete(userId);
    console.log(`➖ Unfollowed user ${userId}`);
  }

  blockUser(userId) {
    this.blocked.add(userId);
    // Auto-unfollow when blocking
    this.following.delete(userId);
    console.log(`🚫 Blocked user ${userId}`);
  }

  unblockUser(userId) {
    this.blocked.delete(userId);
    console.log(`✅ Unblocked user ${userId}`);
  }

  favoriteVideo(videoId) {
    this.favorites.add(videoId);
    console.log(`⭐ Favorited video ${videoId}`);
  }

  unfavoriteVideo(videoId) {
    this.favorites.delete(videoId);
    console.log(`💔 Unfavorited video ${videoId}`);
  }

  isFollowing(userId) {
    return this.following.has(userId);
  }

  isBlocked(userId) {
    return this.blocked.has(userId);
  }

  isFavorited(videoId) {
    return this.favorites.has(videoId);
  }

  getFollowingCount() {
    return this.following.size;
  }

  getBlockedCount() {
    return this.blocked.size;
  }

  getFavoritesCount() {
    return this.favorites.size;
  }

  clearAll() {
    this.following.clear();
    this.blocked.clear();
    this.favorites.clear();
    console.log("🧹 Cleared all social data");
  }
}

// Social-aware API wrapper
class SocialApi {
  constructor() {
    this.social = new SocialManager();
  }

  followUser(userId) {
    this.social.followUser(userId);
  }

  unfollowUser(userId) {
    this.social.unfollowUser(userId);
  }

  blockUser(userId) {
    this.social.blockUser(userId);
  }

  unblockUser(userId) {
    this.social.unblockUser(userId);
  }

  favoriteVideo(videoId) {
    this.social.favoriteVideo(videoId);
  }

  unfavoriteVideo(videoId) {
    this.social.unfavoriteVideo(videoId);
  }

  async getVideoFeed(limit = 10) {
    console.log("📡 Fetching video feed with social features");

    // Get regular feed
    const feed = await videoApi.getVideoFeed(limit);

    // Enhance with social information
    return feed.map((video) => ({
      ...video,
      isFollowing: video.users
        ? this.social.isFollowing(video.users.username)
        : false,
      isFavorited: this.social.isFavorited(video.id),
      isBlocked: video.users
        ? this.social.isBlocked(video.users.username)
        : false,
    }));
  }

  async getVideo(videoId) {
    console.log(`📡 Fetching video ${videoId} with social features`);

    // Get regular video
    const video = await videoApi.getVideo(videoId);

    // Enhance with social information
    return {
      ...video,
      isFollowing: video.users
        ? this.social.isFollowing(video.users.username)
        : false,
      isFavorited: this.social.isFavorited(video.id),
      isBlocked: video.users
        ? this.social.isBlocked(video.users.username)
        : false,
    };
  }

  async getFollowingFeed(limit = 10) {
    console.log("👤 Fetching feed from followed users");

    // Get regular feed
    const feed = await videoApi.getVideoFeed(limit * 2); // Get more to filter

    // Filter by followed users
    const followingFeed = feed
      .filter(
        (video) => video.users && this.social.isFollowing(video.users.username)
      )
      .slice(0, limit);

    console.log(`  Found ${followingFeed.length} videos from followed users`);
    return followingFeed;
  }

  async getFavoriteVideos(limit = 10) {
    console.log("⭐ Fetching favorite videos");

    // Get regular feed
    const feed = await videoApi.getVideoFeed(100); // Get many to filter

    // Filter by favorites
    const favoriteVideos = feed
      .filter((video) => this.social.isFavorited(video.id))
      .slice(0, limit);

    console.log(`  Found ${favoriteVideos.length} favorite videos`);
    return favoriteVideos;
  }

  getSocialStats() {
    return {
      following: this.social.getFollowingCount(),
      blocked: this.social.getBlockedCount(),
      favorites: this.social.getFavoritesCount(),
    };
  }

  clearSocialData() {
    this.social.clearAll();
  }
}

async function socialDemo() {
  try {
    console.log("IG-Live Social Features Demo");
    console.log("==========================");

    const socialApi = new SocialApi();

    // 1. Get initial video feed
    console.log("\n1. Getting initial video feed...");
    const feed = await socialApi.getVideoFeed(5);
    console.log(`  Retrieved ${feed.length} videos`);

    // Show social status of videos
    feed.forEach((video, index) => {
      console.log(`    ${index + 1}. ${video.title}`);
      console.log(`       Following creator: ${video.isFollowing}`);
      console.log(`       Favorited: ${video.isFavorited}`);
      console.log(`       Blocked creator: ${video.isBlocked}`);
    });

    if (feed.length > 0) {
      const firstVideo = feed[0];
      const firstVideoId = firstVideo.id;
      const creatorUsername = firstVideo.users?.username || "unknown";

      console.log(`\n  Using video: ${firstVideo.title}`);
      console.log(`  Creator: @${creatorUsername}`);
      console.log(`  Video ID: ${firstVideoId}`);

      // 2. Social interactions
      console.log("\n2. Performing social interactions...");

      // Follow creator
      console.log("\n  Following creator...");
      socialApi.followUser(creatorUsername);

      // Favorite video
      console.log("\n  Favoriting video...");
      socialApi.favoriteVideo(firstVideoId);

      // Show updated social stats
      const stats = socialApi.getSocialStats();
      console.log("\n  Social stats after interactions:");
      console.log(`    Following: ${stats.following}`);
      console.log(`    Blocked: ${stats.blocked}`);
      console.log(`    Favorites: ${stats.favorites}`);

      // 3. Get updated feed with social info
      console.log("\n3. Getting updated feed with social info...");
      const updatedFeed = await socialApi.getVideoFeed(3);
      console.log(`  Retrieved ${updatedFeed.length} videos`);

      updatedFeed.forEach((video, index) => {
        console.log(`    ${index + 1}. ${video.title}`);
        console.log(`       Following creator: ${video.isFollowing}`);
        console.log(`       Favorited: ${video.isFavorited}`);
      });

      // 4. Get following feed
      console.log("\n4. Getting feed from followed users...");
      const followingFeed = await socialApi.getFollowingFeed(3);
      console.log(
        `  Retrieved ${followingFeed.length} videos from followed users`
      );

      // 5. Get favorite videos
      console.log("\n5. Getting favorite videos...");
      const favoriteVideos = await socialApi.getFavoriteVideos(3);
      console.log(`  Retrieved ${favoriteVideos.length} favorite videos`);

      // 6. Block user
      console.log("\n6. Blocking a user...");
      const secondVideo = feed[1];
      const secondCreator = secondVideo.users?.username || "unknown";
      console.log(`  Blocking @${secondCreator}`);
      socialApi.blockUser(secondCreator);

      // Show updated stats
      const updatedStats = socialApi.getSocialStats();
      console.log("\n  Social stats after blocking:");
      console.log(`    Following: ${updatedStats.following}`);
      console.log(`    Blocked: ${updatedStats.blocked}`);
      console.log(`    Favorites: ${updatedStats.favorites}`);

      // 7. Get feed again (blocked user's content should be handled)
      console.log("\n7. Getting feed after blocking...");
      const finalFeed = await socialApi.getVideoFeed(5);
      console.log(`  Retrieved ${finalFeed.length} videos`);

      finalFeed.forEach((video, index) => {
        console.log(
          `    ${index + 1}. ${video.title} by @${
            video.users?.username || "unknown"
          }`
        );
        console.log(`       Blocked creator: ${video.isBlocked}`);
      });

      // 8. Unblock user
      console.log("\n8. Unblocking user...");
      socialApi.unblockUser(secondCreator);
      console.log(`  Unblocked @${secondCreator}`);
    }

    // 9. Clear social data
    console.log("\n9. Clearing social data...");
    socialApi.clearSocialData();

    const finalStats = socialApi.getSocialStats();
    console.log("\n  Social stats after clearing:");
    console.log(`    Following: ${finalStats.following}`);
    console.log(`    Blocked: ${finalStats.blocked}`);
    console.log(`    Favorites: ${finalStats.favorites}`);

    console.log("\n🎉 Social features demo completed successfully!");
  } catch (error) {
    console.error("❌ Social features demo failed:", error.message);
  }
}

socialDemo();
