// getVideoDemo.js
// This script demonstrates how to get a specific video

const videoApi = require("./src/api/videoApi");

async function getVideoDemo() {
  try {
    console.log("IG-Live Get Video Demo");
    console.log("=====================");

    // Get a video feed to find a video ID
    console.log("\nGetting video feed...");
    const feed = await videoApi.getVideoFeed(1);

    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`Getting video with ID: ${videoId}`);

      // Get the specific video
      console.log("\nGetting video details...");
      const video = await videoApi.getVideo(videoId);
      console.log("Video details:", video);

      console.log("\nGet video demo completed successfully!");
    } else {
      console.log("No videos available");
    }
  } catch (error) {
    console.error("Get video demo failed:", error.message);
  }
}

getVideoDemo();
