// deleteDemo.js
// This script demonstrates how to delete a video

const videoApi = require("./src/api/videoApi");

async function deleteDemo() {
  try {
    console.log("IG-Live Video Delete Demo");
    console.log("========================");

    // First, let's upload a video to delete
    const videoData = {
      title: "Demo Video to Delete",
      description: "This video will be deleted",
      video_url: "https://example.com/demo-video-to-delete.mp4",
    };

    console.log("\nUploading video to delete...");
    const uploadResult = await videoApi.uploadVideo(videoData);
    const videoId = uploadResult.id;
    console.log(`Uploaded video with ID: ${videoId}`);

    // Now delete the video
    console.log("\nDeleting video...");
    const deleteResult = await videoApi.deleteVideo(videoId);
    console.log("Delete result:", deleteResult);

    console.log("\nDelete demo completed successfully!");
  } catch (error) {
    console.error("Delete demo failed:", error.message);
  }
}

deleteDemo();
