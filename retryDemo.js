// retryDemo.js
// This script demonstrates API retry logic

const videoApi = require("./src/api/videoApi");

// Retry utility
class RetryHandler {
  static async execute(operation, maxRetries = 3, delay = 1000) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`  Attempt ${attempt}/${maxRetries}...`);
        const result = await operation();
        console.log(`  ✓ Success on attempt ${attempt}`);
        return result;
      } catch (error) {
        lastError = error;
        console.log(`  ✗ Attempt ${attempt} failed: ${error.message}`);

        // Don't delay after the last attempt
        if (attempt < maxRetries) {
          console.log(`  Waiting ${delay}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        }
      }
    }

    throw new Error(
      `Operation failed after ${maxRetries} attempts: ${lastError.message}`
    );
  }
}

async function retryDemo() {
  try {
    console.log("IG-Live Retry Logic Demo");
    console.log("======================");

    // 1. Successful operation with retry wrapper
    console.log("\n1. Successful operation with retry wrapper...");
    const feed = await RetryHandler.execute(
      () => videoApi.getVideoFeed(3),
      3, // max retries
      500 // initial delay
    );
    console.log(`✓ Retrieved ${feed.length} videos`);

    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`\nUsing video ID: ${videoId}`);

      // 2. Operation that might fail (simulate with invalid ID first)
      console.log("\n2. Operation with potential failure...");

      // First try with an invalid ID to demonstrate retry
      console.log("\n  Trying with invalid ID first...");
      try {
        await RetryHandler.execute(
          () => videoApi.getVideo("invalid-id"),
          2, // fewer retries for demo
          300
        );
      } catch (error) {
        console.log(`  ✓ Correctly failed after retries: ${error.message}`);
      }

      // Then try with valid ID
      console.log("\n  Trying with valid ID...");
      const video = await RetryHandler.execute(
        () => videoApi.getVideo(videoId),
        2,
        300
      );
      console.log(`  ✓ Retrieved video: ${video.title}`);

      // 3. Multiple operations with retry
      console.log("\n3. Multiple operations with retry...");

      const operations = [
        { name: "Like video", operation: () => videoApi.likeVideo(videoId) },
        {
          name: "Add comment",
          operation: () =>
            videoApi.commentOnVideo(videoId, "Retry demo comment"),
        },
        {
          name: "Share video",
          operation: () => videoApi.shareVideo(videoId, "retry_demo"),
        },
      ];

      for (const { name, operation } of operations) {
        console.log(`\n  ${name}...`);
        try {
          const result = await RetryHandler.execute(operation, 2, 200);
          console.log(`  ✓ ${name} succeeded`);
        } catch (error) {
          console.log(`  ✗ ${name} failed: ${error.message}`);
        }
      }
    }

    // 4. Simulate network issues with a mock API call
    console.log("\n4. Simulating network issues...");

    // Mock API call that fails randomly
    const unreliableApiCall = async () => {
      // 70% chance of failure
      if (Math.random() < 0.7) {
        throw new Error("Network error");
      }
      return await videoApi.getVideoFeed(1);
    };

    try {
      const result = await RetryHandler.execute(
        unreliableApiCall,
        5, // more retries for unreliable operation
        200
      );
      console.log(`✓ Unreliable operation succeeded: ${result.length} videos`);
    } catch (error) {
      console.log(`✗ Unreliable operation failed: ${error.message}`);
    }

    console.log("\n🎉 Retry logic demo completed successfully!");
  } catch (error) {
    console.error("❌ Retry logic demo failed:", error.message);
  }
}

retryDemo();
