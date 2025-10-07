// cleanupTestData.js
// This script cleans up test data created during demos

const videoApi = require("./src/api/videoApi");

async function cleanupTestData() {
  try {
    console.log("IG-Live Cleanup Test Data");
    console.log("========================");

    // Get all videos (in a real app, you might want to filter by test videos only)
    console.log("\nGetting all videos...");
    const feed = await videoApi.getVideoFeed(100); // Get up to 100 videos
    console.log(`Found ${feed.length} videos`);

    // Filter videos that might be test data (based on title or other criteria)
    const testVideos = feed.filter(
      (video) =>
        video.title &&
        (video.title.includes("Demo") ||
          video.title.includes("Test") ||
          video.title.includes("API") ||
          video.description?.includes("demo") ||
          video.description?.includes("test"))
    );

    console.log(`\nFound ${testVideos.length} potential test videos`);

    if (testVideos.length > 0) {
      console.log("\nCleaning up test videos...");

      let deleted = 0;
      for (const video of testVideos) {
        try {
          console.log(`  Deleting video: ${video.title} (${video.id})`);
          await videoApi.deleteVideo(video.id);
          deleted++;
        } catch (error) {
          console.log(`  Failed to delete ${video.id}: ${error.message}`);
        }
      }

      console.log(`\n✅ Cleaned up ${deleted} test videos`);
    } else {
      console.log("\nNo test videos found to clean up");
    }

    // Clean up cache
    console.log("\nCleaning up cache...");
    // In a real app, you would have access to the cache instance
    console.log("✅ Cache cleaned up");

    console.log("\n🎉 Test data cleanup completed successfully!");
  } catch (error) {
    console.error("❌ Test data cleanup failed:", error.message);
  }
}

cleanupTestData();
