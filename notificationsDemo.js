// notificationsDemo.js
// This script demonstrates API with notifications

const videoApi = require("./src/api/videoApi");

// Notification manager
class NotificationManager {
  constructor() {
    this.notifications = [];
    this.listeners = [];
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  notify(type, message, data = {}) {
    const notification = {
      id: Date.now() + Math.random(),
      type,
      message,
      data,
      timestamp: new Date().toISOString(),
      read: false,
    };

    this.notifications.push(notification);

    // Notify all listeners
    this.listeners.forEach((callback) => {
      try {
        callback(notification);
      } catch (error) {
        console.error("Error in notification listener:", error);
      }
    });

    console.log(`🔔 Notification [${type}]: ${message}`);
    return notification;
  }

  markAsRead(notificationId) {
    const notification = this.notifications.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      notification.read = true;
      console.log(`✅ Marked notification as read: ${notification.message}`);
    }
  }

  getUnreadCount() {
    return this.notifications.filter((n) => !n.read).length;
  }

  getNotifications(filter = {}) {
    let filtered = this.notifications;

    if (filter.type) {
      filtered = filtered.filter((n) => n.type === filter.type);
    }

    if (filter.read !== undefined) {
      filtered = filtered.filter((n) => n.read === filter.read);
    }

    // Sort by timestamp descending (newest first)
    return filtered.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }

  clearNotifications() {
    this.notifications = [];
    console.log("🧹 Cleared all notifications");
  }
}

// Notifications-aware API wrapper
class NotificationsApi {
  constructor() {
    this.notifications = new NotificationManager();
  }

  addNotificationListener(callback) {
    this.notifications.addListener(callback);
  }

  removeNotificationListener(callback) {
    this.notifications.removeListener(callback);
  }

  async getVideoFeed(limit = 10) {
    try {
      console.log("📡 Fetching video feed");
      const feed = await videoApi.getVideoFeed(limit);

      this.notifications.notify("success", "Video feed loaded successfully", {
        videoCount: feed.length,
      });

      return feed;
    } catch (error) {
      this.notifications.notify("error", "Failed to load video feed", {
        error: error.message,
      });
      throw error;
    }
  }

  async getVideo(videoId) {
    try {
      console.log(`📡 Fetching video ${videoId}`);
      const video = await videoApi.getVideo(videoId);

      this.notifications.notify("success", `Video "${video.title}" loaded`, {
        videoId,
        title: video.title,
      });

      return video;
    } catch (error) {
      this.notifications.notify("error", "Failed to load video", {
        videoId,
        error: error.message,
      });
      throw error;
    }
  }

  async likeVideo(videoId) {
    try {
      console.log(`📡 Liking video ${videoId}`);
      const result = await videoApi.likeVideo(videoId);

      this.notifications.notify(
        "info",
        result.liked ? "Video liked" : "Video unliked",
        {
          videoId,
          liked: result.liked,
        }
      );

      return result;
    } catch (error) {
      this.notifications.notify("error", "Failed to like video", {
        videoId,
        error: error.message,
      });
      throw error;
    }
  }

  async commentOnVideo(videoId, text) {
    try {
      console.log(`📡 Adding comment to video ${videoId}`);
      const result = await videoApi.commentOnVideo(videoId, text);

      this.notifications.notify("info", "Comment added successfully", {
        videoId,
        commentId: result.id,
        commentLength: text.length,
      });

      return result;
    } catch (error) {
      this.notifications.notify("error", "Failed to add comment", {
        videoId,
        error: error.message,
      });
      throw error;
    }
  }

  async uploadVideo(videoData) {
    try {
      console.log("📡 Uploading video");
      const result = await videoApi.uploadVideo(videoData);

      this.notifications.notify(
        "success",
        `Video "${result.title}" uploaded successfully`,
        {
          videoId: result.id,
          title: result.title,
        }
      );

      return result;
    } catch (error) {
      this.notifications.notify("error", "Failed to upload video", {
        error: error.message,
      });
      throw error;
    }
  }

  getNotifications(filter) {
    return this.notifications.getNotifications(filter);
  }

  markNotificationAsRead(notificationId) {
    this.notifications.markAsRead(notificationId);
  }

  getUnreadNotificationCount() {
    return this.notifications.getUnreadCount();
  }

  clearNotifications() {
    this.notifications.clearNotifications();
  }
}

// Simple notification UI simulator
class NotificationUI {
  constructor() {
    this.container = "Notification Panel";
  }

  showNotification(notification) {
    const icons = {
      success: "✅",
      error: "❌",
      info: "ℹ️",
      warning: "⚠️",
    };

    const icon = icons[notification.type] || "🔔";
    console.log(
      `${icon} [${notification.type.toUpperCase()}] ${notification.message}`
    );

    if (Object.keys(notification.data).length > 0) {
      console.log(`   Data: ${JSON.stringify(notification.data)}`);
    }
  }
}

async function notificationsDemo() {
  try {
    console.log("IG-Live Notifications Demo");
    console.log("========================");

    const notificationsApi = new NotificationsApi();
    const notificationUI = new NotificationUI();

    // 1. Add notification listener
    console.log("\n1. Setting up notification listener...");
    notificationsApi.addNotificationListener((notification) => {
      notificationUI.showNotification(notification);
    });

    // 2. Perform operations that generate notifications
    console.log("\n2. Performing operations that generate notifications...");

    // Get video feed
    console.log("\n  Getting video feed...");
    const feed = await notificationsApi.getVideoFeed(3);
    console.log(`  Retrieved ${feed.length} videos`);

    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`  Using video ID: ${videoId}`);

      // Get video
      console.log("\n  Getting video...");
      const video = await notificationsApi.getVideo(videoId);
      console.log(`  Retrieved video: ${video.title}`);

      // Like video
      console.log("\n  Liking video...");
      const likeResult = await notificationsApi.likeVideo(videoId);
      console.log(`  Video ${likeResult.liked ? "liked" : "unliked"}`);

      // Add comment
      console.log("\n  Adding comment...");
      const commentResult = await notificationsApi.commentOnVideo(
        videoId,
        "Notifications demo comment"
      );
      console.log(`  Comment added with ID: ${commentResult.id}`);

      // Upload video
      console.log("\n  Uploading video...");
      const uploadData = {
        title: "Notifications Demo Video",
        description: "Uploaded with notifications",
        video_url: "https://example.com/notifications-demo.mp4",
      };
      const uploadResult = await notificationsApi.uploadVideo(uploadData);
      console.log(`  Video uploaded with ID: ${uploadResult.id}`);
    }

    // 3. Show notification statistics
    console.log("\n3. Notification statistics:");
    console.log(
      `  Total notifications: ${notificationsApi.getNotifications().length}`
    );
    console.log(
      `  Unread notifications: ${notificationsApi.getUnreadNotificationCount()}`
    );

    // 4. Show different types of notifications
    console.log("\n4. Filtering notifications by type:");

    const successNotifications = notificationsApi.getNotifications({
      type: "success",
    });
    console.log(`  Success notifications: ${successNotifications.length}`);

    const errorNotifications = notificationsApi.getNotifications({
      type: "error",
    });
    console.log(`  Error notifications: ${errorNotifications.length}`);

    const infoNotifications = notificationsApi.getNotifications({
      type: "info",
    });
    console.log(`  Info notifications: ${infoNotifications.length}`);

    // 5. Show unread notifications
    console.log("\n5. Unread notifications:");
    const unreadNotifications = notificationsApi.getNotifications({
      read: false,
    });
    unreadNotifications.forEach((notification) => {
      console.log(`  - [${notification.type}] ${notification.message}`);
    });

    // 6. Mark notifications as read
    console.log("\n6. Marking notifications as read...");
    const notificationsToMark = notificationsApi.getNotifications({
      read: false,
    });
    notificationsToMark.forEach((notification) => {
      notificationsApi.markNotificationAsRead(notification.id);
    });

    console.log(`  Marked ${notificationsToMark.length} notifications as read`);
    console.log(
      `  Unread notifications now: ${notificationsApi.getUnreadNotificationCount()}`
    );

    // 7. Clear all notifications
    console.log("\n7. Clearing all notifications...");
    notificationsApi.clearNotifications();
    console.log(
      `  Notifications after clear: ${
        notificationsApi.getNotifications().length
      }`
    );

    console.log("\n🎉 Notifications demo completed successfully!");
  } catch (error) {
    console.error("❌ Notifications demo failed:", error.message);
  }
}

notificationsDemo();
