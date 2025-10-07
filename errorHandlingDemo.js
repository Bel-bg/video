// errorHandlingDemo.js
// This script demonstrates error handling

const videoApi = require("./src/api/videoApi");

async function errorHandlingDemo() {
  try {
    console.log("IG-Live Error Handling Demo");
    console.log("==========================");

    // 1. Try to get a video with an invalid ID
    console.log("\n1. Trying to get video with invalid ID...");
    try {
      await videoApi.getVideo("invalid-id");
      console.log("❌ This should have failed");
    } catch (error) {
      console.log("✓ Correctly caught error:", error.message);
    }

    // 2. Try to like a video with an invalid ID
    console.log("\n2. Trying to like video with invalid ID...");
    try {
      await videoApi.likeVideo("invalid-id");
      console.log("❌ This should have failed");
    } catch (error) {
      console.log("✓ Correctly caught error:", error.message);
    }

    // 3. Try to comment on a video with an invalid ID
    console.log("\n3. Trying to comment on video with invalid ID...");
    try {
      await videoApi.commentOnVideo("invalid-id", "Test comment");
      console.log("❌ This should have failed");
    } catch (error) {
      console.log("✓ Correctly caught error:", error.message);
    }

    // 4. Try to upload a video without required fields
    console.log("\n4. Trying to upload video without video_url...");
    try {
      await videoApi.uploadVideo({ title: "Test" });
      console.log("❌ This should have failed");
    } catch (error) {
      console.log("✓ Correctly caught error:", error.message);
    }

    // 5. Try to delete a video with an invalid ID
    console.log("\n5. Trying to delete video with invalid ID...");
    try {
      await videoApi.deleteVideo("invalid-id");
      console.log("❌ This should have failed");
    } catch (error) {
      console.log("✓ Correctly caught error:", error.message);
    }

    console.log("\n🎉 Error handling demo completed successfully!");
  } catch (error) {
    console.error("❌ Error handling demo failed unexpectedly:", error.message);
  }
}

errorHandlingDemo();
