// videoOperationsDemo.js
// This script demonstrates various video operations

const videoApi = require("./src/api/videoApi");

async function videoOperationsDemo() {
  try {
    console.log("IG-Live Video Operations Demo");
    console.log("============================");

    // 1. Upload a video
    console.log("\n1. Uploading a video...");
    const videoData = {
      title: "Video Operations Demo",
      description: "Demonstrating various video operations",
      video_url: "https://example.com/video-operations-demo.mp4",
      thumbnail_url: "https://example.com/video-operations-demo-thumb.jpg",
    };
    const uploadedVideo = await videoApi.uploadVideo(videoData);
    const videoId = uploadedVideo.id;
    console.log(`✓ Video uploaded with ID: ${videoId}`);

    // 2. Get the uploaded video
    console.log("\n2. Getting the uploaded video...");
    const video = await videoApi.getVideo(videoId);
    console.log(`✓ Video title: ${video.title}`);
    console.log(`  Views: ${video.views_count}`);
    console.log(`  Likes: ${video.likes_count}`);
    console.log(`  Comments: ${video.comments_count}`);

    // 3. Like the video multiple times
    console.log("\n3. Liking the video 3 times...");
    for (let i = 1; i <= 3; i++) {
      const likeResult = await videoApi.likeVideo(videoId);
      console.log(`  Like ${i}: ${likeResult.liked ? "Liked" : "Unliked"}`);
    }

    // 4. Get the updated video
    console.log("\n4. Getting the updated video...");
    const updatedVideo = await videoApi.getVideo(videoId);
    console.log(`  Updated likes: ${updatedVideo.likes_count}`);

    // 5. Add multiple comments
    console.log("\n5. Adding 3 comments...");
    const comments = ["First comment!", "Second comment!", "Third comment!"];

    for (let i = 0; i < comments.length; i++) {
      const comment = await videoApi.commentOnVideo(videoId, comments[i]);
      console.log(`  Added comment ${i + 1}: ${comment.text}`);
    }

    // 6. Get comments
    console.log("\n6. Getting all comments...");
    const allComments = await videoApi.getVideoComments(videoId, 1, 10);
    console.log(`  Retrieved ${allComments.comments.length} comments`);

    // 7. Share the video
    console.log("\n7. Sharing the video...");
    const shareResult = await videoApi.shareVideo(videoId, "demo_platform");
    console.log("✓ Video shared");

    // 8. Get the final video state
    console.log("\n8. Getting final video state...");
    const finalVideo = await videoApi.getVideo(videoId);
    console.log(`  Final views: ${finalVideo.views_count}`);
    console.log(`  Final likes: ${finalVideo.likes_count}`);
    console.log(`  Final comments: ${finalVideo.comments_count}`);

    // 9. Delete the video
    console.log("\n9. Deleting the video...");
    const deleteResult = await videoApi.deleteVideo(videoId);
    console.log("✓ Video deleted");

    console.log("\n🎉 Video operations demo completed successfully!");
  } catch (error) {
    console.error("❌ Video operations demo failed:", error.message);
  }
}

videoOperationsDemo();
