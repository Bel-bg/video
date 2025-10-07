// replyDemo.js
// This script demonstrates how to reply to a comment

const videoApi = require("./src/api/videoApi");

async function replyDemo() {
  try {
    console.log("IG-Live Video Reply Demo");
    console.log("=======================");

    // Get a video with comments
    console.log("\nGetting video feed...");
    const feed = await videoApi.getVideoFeed(1);

    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`Using video with ID: ${videoId}`);

      // Get comments for the video
      console.log("\nGetting comments...");
      const comments = await videoApi.getVideoComments(videoId, 1, 5);

      if (comments.comments.length > 0) {
        const commentId = comments.comments[0].id;
        console.log(`Replying to comment with ID: ${commentId}`);

        // Reply to the comment
        console.log("\nReplying to comment...");
        const replyResult = await videoApi.replyToComment(
          videoId,
          commentId,
          "This is a reply!"
        );
        console.log("Reply result:", replyResult);

        console.log("\nReply demo completed successfully!");
      } else {
        console.log("No comments available to reply to");
      }
    } else {
      console.log("No videos available");
    }
  } catch (error) {
    console.error("Reply demo failed:", error.message);
  }
}

replyDemo();
