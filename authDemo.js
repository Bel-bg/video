// authDemo.js
// This script demonstrates how to use the API with authentication

const videoApi = require("./src/api/videoApi");

// Mock user authentication (in a real app, you'd get this from your auth system)
const mockUserId = "user-123";

async function authDemo() {
  try {
    console.log("IG-Live Authentication Demo");
    console.log("==========================");

    // Set up mock authentication
    // In a real application, the videoApi would automatically use the current user's token
    console.log(`\nUsing mock user ID: ${mockUserId}`);

    // 1. Get video feed (no auth required)
    console.log("\n1. Getting video feed...");
    const feed = await videoApi.getVideoFeed(3);
    console.log(`✓ Retrieved ${feed.length} videos`);

    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`Using video ID: ${videoId}`);

      // 2. Like video (auth required)
      console.log("\n2. Liking video...");
      const likeResult = await videoApi.likeVideo(videoId);
      console.log("✓ Video liked");

      // 3. Add comment (auth required)
      console.log("\n3. Adding comment...");
      const newComment = await videoApi.commentOnVideo(
        videoId,
        "Auth demo comment"
      );
      console.log("✓ Comment added");

      // 4. Upload video (auth required)
      console.log("\n4. Uploading video...");
      const uploadData = {
        title: "Auth Demo Video",
        description: "Uploaded with authentication",
        video_url: "https://example.com/auth-demo.mp4",
      };
      const uploadResult = await videoApi.uploadVideo(uploadData);
      console.log("✓ Video uploaded");

      // 5. Delete video (auth required)
      console.log("\n5. Deleting video...");
      const deleteResult = await videoApi.deleteVideo(uploadResult.id);
      console.log("✓ Video deleted");
    }

    console.log("\n🎉 Authentication demo completed successfully!");
  } catch (error) {
    console.error("❌ Authentication demo failed:", error.message);
  }
}

authDemo();
