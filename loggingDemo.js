// loggingDemo.js
// This script demonstrates API logging

const videoApi = require("./src/api/videoApi");

// Simple logging utility
class Logger {
  constructor(level = "info") {
    this.level = level;
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };
  }

  log(level, message, data = null) {
    if (this.levels[level] <= this.levels[this.level]) {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

      if (data) {
        console.log(logMessage, data);
      } else {
        console.log(logMessage);
      }
    }
  }

  error(message, data) {
    this.log("error", message, data);
  }

  warn(message, data) {
    this.log("warn", message, data);
  }

  info(message, data) {
    this.log("info", message, data);
  }

  debug(message, data) {
    this.log("debug", message, data);
  }
}

const logger = new Logger("debug");

// Wrapper for API calls with logging
function loggedApiCall(name, apiCall) {
  return async (...args) => {
    logger.info(`Starting ${name}`, { args });
    const start = Date.now();

    try {
      const result = await apiCall(...args);
      const end = Date.now();
      logger.info(`Completed ${name}`, {
        duration: `${end - start}ms`,
        result:
          typeof result === "object"
            ? `${JSON.stringify(result).substring(0, 100)}...`
            : result,
      });
      return result;
    } catch (error) {
      const end = Date.now();
      logger.error(`Failed ${name}`, {
        duration: `${end - start}ms`,
        error: error.message,
      });
      throw error;
    }
  };
}

async function loggingDemo() {
  try {
    logger.info("IG-Live Logging Demo", { version: "1.0.0" });

    // Wrap API calls with logging
    const loggedGetVideoFeed = loggedApiCall(
      "getVideoFeed",
      videoApi.getVideoFeed
    );
    const loggedGetVideo = loggedApiCall("getVideo", videoApi.getVideo);
    const loggedLikeVideo = loggedApiCall("likeVideo", videoApi.likeVideo);
    const loggedCommentOnVideo = loggedApiCall(
      "commentOnVideo",
      videoApi.commentOnVideo
    );

    // 1. Get video feed
    logger.info("Getting video feed...");
    const feed = await loggedGetVideoFeed(3);
    logger.info("Retrieved video feed", { count: feed.length });

    if (feed.length > 0) {
      const videoId = feed[0].id;
      logger.info("Using video for operations", { videoId });

      // 2. Get video details
      logger.info("Getting video details...");
      const video = await loggedGetVideo(videoId);
      logger.info("Retrieved video details", { title: video.title });

      // 3. Like video
      logger.info("Liking video...");
      const likeResult = await loggedLikeVideo(videoId);
      logger.info("Video like result", { liked: likeResult.liked });

      // 4. Add comment
      logger.info("Adding comment...");
      const commentResult = await loggedCommentOnVideo(
        videoId,
        "Logging demo comment"
      );
      logger.info("Comment added", { commentId: commentResult.id });
    }

    logger.info("Logging demo completed successfully");
  } catch (error) {
    logger.error("Logging demo failed", { error: error.message });
  }
}

loggingDemo();
