// uploadDemo.js
// This script demonstrates how to upload a video

const videoApi = require("./src/api/videoApi");

async function uploadDemo() {
  try {
    console.log("IG-Live Video Upload Demo");
    console.log("========================");

    // In a real application, you would get the video URL from ImageKit after uploading
    // For this demo, we'll use a placeholder URL
    const videoData = {
      title: "Demo Video",
      description: "This is a demo video uploaded through the API",
      video_url: "https://example.com/demo-video.mp4",
      thumbnail_url: "https://example.com/demo-thumbnail.jpg",
    };

    console.log("\nUploading video...");
    const result = await videoApi.uploadVideo(videoData);
    console.log("Upload result:", result);

    console.log("\nUpload demo completed successfully!");
  } catch (error) {
    console.error("Upload demo failed:", error.message);
  }
}

uploadDemo();
