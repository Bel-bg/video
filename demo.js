// demo.js
// This script demonstrates how to use the video API

const videoApi = require("./src/api/videoApi");

async function demo() {
  try {
    console.log("IG-Live Video API Demo");
    console.log("=====================");

    // 1. Get video feed
    console.log("\n1. Getting video feed...");
    const feed = await videoApi.getVideoFeed(5);
    console.log(`Retrieved ${feed.length} videos`);

    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`Using video ID: ${videoId}`);

      // 2. Like a video
      console.log("\n2. Liking video...");
      const likeResult = await videoApi.likeVideo(videoId);
      console.log("Like result:", likeResult);

      // 3. Get comments
      console.log("\n3. Getting comments...");
      const comments = await videoApi.getVideoComments(videoId, 1, 10);
      console.log(`Retrieved ${comments.comments.length} comments`);

      // 4. Add a comment
      console.log("\n4. Adding comment...");
      const newComment = await videoApi.commentOnVideo(videoId, "Great video!");
      console.log("Comment added:", newComment);
    }

    console.log("\nDemo completed successfully!");
  } catch (error) {
    console.error("Demo failed:", error.message);
  }
}

demo();
