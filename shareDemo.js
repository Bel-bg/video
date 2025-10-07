// shareDemo.js
// This script demonstrates how to share a video

const videoApi = require("./src/api/videoApi");

async function shareDemo() {
  try {
    console.log("IG-Live Video Share Demo");
    console.log("=======================");

    // Get a video to share (in a real app, you'd have a specific video ID)
    console.log("\nGetting video feed...");
    const feed = await videoApi.getVideoFeed(1);

    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`Sharing video with ID: ${videoId}`);

      // Share the video
      console.log("\nSharing video...");
      const shareResult = await videoApi.shareVideo(videoId, "social_media");
      console.log("Share result:", shareResult);

      console.log("\nShare demo completed successfully!");
    } else {
      console.log("No videos available to share");
    }
  } catch (error) {
    console.error("Share demo failed:", error.message);
  }
}

shareDemo();
