// accessibilityDemo.js
// This script demonstrates API accessibility features

const videoApi = require("./src/api/videoApi");

// Accessibility utilities
class AccessibilityManager {
  static addAltText(videoData) {
    // Add descriptive alt text for screen readers
    if (!videoData.altText) {
      if (videoData.title) {
        videoData.altText = `Video: ${videoData.title}`;
      } else if (videoData.description) {
        videoData.altText = `Video content: ${videoData.description.substring(
          0,
          100
        )}...`;
      } else {
        videoData.altText = "Unnamed video content";
      }
    }
    return videoData;
  }

  static formatDuration(seconds) {
    // Format duration in accessible ways
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    if (mins > 0) {
      return `${mins} minute${mins !== 1 ? "s" : ""} and ${secs} second${
        secs !== 1 ? "s" : ""
      }`;
    }
    return `${secs} second${secs !== 1 ? "s" : ""}`;
  }

  static addCaptionsInfo(videoData) {
    // Add caption information for accessibility
    videoData.hasCaptions = videoData.captionsUrl ? true : false;
    videoData.captionsLanguages = videoData.captionsLanguages || ["en"];
    return videoData;
  }

  static addAudioDescriptionInfo(videoData) {
    // Add audio description information
    videoData.hasAudioDescription = videoData.audioDescriptionUrl
      ? true
      : false;
    return videoData;
  }
}

// Accessible API wrapper
class AccessibleApi {
  async getVideoFeed(limit = 10) {
    const feed = await videoApi.getVideoFeed(limit);

    // Enhance video data with accessibility information
    return feed.map((video) => {
      // Add accessibility features
      video = AccessibilityManager.addAltText(video);
      video = AccessibilityManager.addCaptionsInfo(video);
      video = AccessibilityManager.addAudioDescriptionInfo(video);

      // Add formatted duration if available
      if (video.duration) {
        video.formattedDuration = AccessibilityManager.formatDuration(
          video.duration
        );
      }

      return video;
    });
  }

  async getVideo(videoId) {
    const video = await videoApi.getVideo(videoId);

    // Add accessibility features
    video = AccessibilityManager.addAltText(video);
    video = AccessibilityManager.addCaptionsInfo(video);
    video = AccessibilityManager.addAudioDescriptionInfo(video);

    // Add formatted duration if available
    if (video.duration) {
      video.formattedDuration = AccessibilityManager.formatDuration(
        video.duration
      );
    }

    return video;
  }

  async uploadVideo(videoData) {
    // Ensure accessibility features are included
    videoData = AccessibilityManager.addAltText(videoData);
    videoData = AccessibilityManager.addCaptionsInfo(videoData);
    videoData = AccessibilityManager.addAudioDescriptionInfo(videoData);

    return await videoApi.uploadVideo(videoData);
  }
}

async function accessibilityDemo() {
  try {
    console.log("IG-Live Accessibility Demo");
    console.log("========================");

    const accessibleApi = new AccessibleApi();

    // 1. Upload a video with accessibility features
    console.log("\n1. Uploading video with accessibility features...");
    const videoData = {
      title: "Accessibility Demo Video",
      description: "This video demonstrates accessibility features",
      video_url: "https://example.com/accessibility-demo.mp4",
      duration: 125, // 2 minutes and 5 seconds
      captionsUrl: "https://example.com/accessibility-demo-captions.vtt",
      captionsLanguages: ["en", "es", "fr"],
      audioDescriptionUrl:
        "https://example.com/accessibility-demo-audio-desc.mp3",
    };

    const uploadedVideo = await accessibleApi.uploadVideo(videoData);
    console.log("✓ Video uploaded with accessibility features");
    console.log(`  Alt text: ${uploadedVideo.altText}`);
    console.log(`  Has captions: ${uploadedVideo.hasCaptions}`);
    console.log(
      `  Caption languages: ${uploadedVideo.captionsLanguages.join(", ")}`
    );
    console.log(
      `  Has audio description: ${uploadedVideo.hasAudioDescription}`
    );
    console.log(`  Formatted duration: ${uploadedVideo.formattedDuration}`);

    // 2. Get video feed with accessibility features
    console.log("\n2. Getting video feed with accessibility features...");
    const feed = await accessibleApi.getVideoFeed(3);
    console.log(
      `✓ Retrieved ${feed.length} videos with accessibility features`
    );

    feed.forEach((video, index) => {
      console.log(`\n  Video ${index + 1}:`);
      console.log(`    Title: ${video.title}`);
      console.log(`    Alt text: ${video.altText}`);
      console.log(`    Has captions: ${video.hasCaptions}`);
      console.log(`    Has audio description: ${video.hasAudioDescription}`);
      if (video.formattedDuration) {
        console.log(`    Duration: ${video.formattedDuration}`);
      }
    });

    // 3. Get specific video with accessibility features
    console.log("\n3. Getting specific video with accessibility features...");
    if (feed.length > 0) {
      const videoId = feed[0].id;
      const video = await accessibleApi.getVideo(videoId);
      console.log("✓ Retrieved video with accessibility features");
      console.log(`  Alt text: ${video.altText}`);
      console.log(`  Has captions: ${video.hasCaptions}`);
      console.log(`  Has audio description: ${video.hasAudioDescription}`);
      console.log(`  Formatted duration: ${video.formattedDuration}`);
    }

    // 4. Upload video without explicit accessibility features
    console.log(
      "\n4. Uploading video without explicit accessibility features..."
    );
    const minimalVideoData = {
      title: "Minimal Video",
      video_url: "https://example.com/minimal-video.mp4",
      duration: 45,
    };

    const minimalVideo = await accessibleApi.uploadVideo(minimalVideoData);
    console.log("✓ Video uploaded with auto-generated accessibility features");
    console.log(`  Auto-generated alt text: ${minimalVideo.altText}`);
    console.log(`  Has captions: ${minimalVideo.hasCaptions}`);
    console.log(`  Has audio description: ${minimalVideo.hasAudioDescription}`);
    console.log(`  Formatted duration: ${minimalVideo.formattedDuration}`);

    console.log("\n🎉 Accessibility demo completed successfully!");
  } catch (error) {
    console.error("❌ Accessibility demo failed:", error.message);
  }
}

accessibilityDemo();
