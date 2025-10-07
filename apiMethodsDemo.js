// apiMethodsDemo.js
// This script demonstrates all available API methods

const videoApi = require("./src/api/videoApi");

async function apiMethodsDemo() {
  try {
    console.log("IG-Live Video API Methods Demo");
    console.log("=============================");

    // 1. Get ImageKit authentication parameters
    console.log("\n1. Getting ImageKit auth parameters...");
    const authParams = await videoApi.getImageKitAuth();
    console.log("✓ Got auth parameters");

    // 2. Get video feed
    console.log("\n2. Getting video feed...");
    const feed = await videoApi.getVideoFeed(3);
    console.log(`✓ Retrieved ${feed.length} videos`);

    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`Using video ID: ${videoId}`);

      // 3. Get specific video
      console.log("\n3. Getting specific video...");
      const video = await videoApi.getVideo(videoId);
      console.log("✓ Got video details");

      // 4. Like video
      console.log("\n4. Liking video...");
      const likeResult = await videoApi.likeVideo(videoId);
      console.log("✓ Video liked");

      // 5. Get comments
      console.log("\n5. Getting comments...");
      const comments = await videoApi.getVideoComments(videoId, 1, 5);
      console.log(`✓ Retrieved ${comments.comments.length} comments`);

      // 6. Add comment
      console.log("\n6. Adding comment...");
      const newComment = await videoApi.commentOnVideo(videoId, "Great demo!");
      console.log("✓ Comment added");

      // 7. Reply to comment
      console.log("\n7. Replying to comment...");
      const replyResult = await videoApi.replyToComment(
        videoId,
        newComment.id,
        "Thanks for watching!"
      );
      console.log("✓ Reply added");

      // 8. Share video
      console.log("\n8. Sharing video...");
      const shareResult = await videoApi.shareVideo(videoId, "demo_platform");
      console.log("✓ Video shared");

      // 9. Upload video (demo)
      console.log("\n9. Uploading video (demo)...");
      const uploadData = {
        title: "API Demo Video",
        description: "Uploaded via API demo",
        video_url: "https://example.com/demo.mp4",
      };
      const uploadResult = await videoApi.uploadVideo(uploadData);
      console.log("✓ Video uploaded");

      // 10. Delete video (the one we just uploaded)
      console.log("\n10. Deleting video...");
      const deleteResult = await videoApi.deleteVideo(uploadResult.id);
      console.log("✓ Video deleted");
    }

    console.log("\n🎉 All API methods demo completed successfully!");
  } catch (error) {
    console.error("❌ API methods demo failed:", error.message);
  }
}

apiMethodsDemo();
