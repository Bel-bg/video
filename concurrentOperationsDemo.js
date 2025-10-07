// concurrentOperationsDemo.js
// This script demonstrates concurrent API operations

const videoApi = require("./src/api/videoApi");

async function concurrentOperationsDemo() {
  try {
    console.log("IG-Live Concurrent Operations Demo");
    console.log("=================================");

    // 1. Get video feed
    console.log("\n1. Getting video feed...");
    const feed = await videoApi.getVideoFeed(5);
    console.log(`✓ Retrieved ${feed.length} videos`);

    if (feed.length > 0) {
      // 2. Perform concurrent operations on multiple videos
      console.log("\n2. Performing concurrent operations...");

      // Create an array of promises for concurrent operations
      const operations = feed.slice(0, 3).map(async (video, index) => {
        console.log(
          `  Starting operations on video ${index + 1} (${video.id})`
        );

        // Get video details
        const videoDetails = await videoApi.getVideo(video.id);

        // Like the video
        const likeResult = await videoApi.likeVideo(video.id);

        // Add a comment
        const commentResult = await videoApi.commentOnVideo(
          video.id,
          `Concurrent comment ${index + 1}`
        );

        // Share the video
        const shareResult = await videoApi.shareVideo(
          video.id,
          `platform_${index + 1}`
        );

        return {
          videoId: video.id,
          title: videoDetails.title,
          liked: likeResult.liked,
          commentId: commentResult.id,
          shared: shareResult.success,
        };
      });

      // Execute all operations concurrently
      const results = await Promise.all(operations);

      console.log("\n✓ Concurrent operations completed:");
      results.forEach((result, index) => {
        console.log(`  Video ${index + 1}: ${result.title}`);
        console.log(`    Liked: ${result.liked}`);
        console.log(`    Comment ID: ${result.commentId}`);
        console.log(`    Shared: ${result.shared}`);
      });
    }

    console.log("\n🎉 Concurrent operations demo completed successfully!");
  } catch (error) {
    console.error("❌ Concurrent operations demo failed:", error.message);
  }
}

concurrentOperationsDemo();
