// timeoutDemo.js
// This script demonstrates API timeouts

const videoApi = require("./src/api/videoApi");

// Timeout utility
class TimeoutHandler {
  static async execute(operation, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
      // Create timeout
      const timeout = setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      // Execute operation
      operation()
        .then((result) => {
          clearTimeout(timeout);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timeout);
          reject(error);
        });
    });
  }
}

async function timeoutDemo() {
  try {
    console.log("IG-Live Timeout Demo");
    console.log("==================");

    // 1. Normal operation within timeout
    console.log("\n1. Normal operation within timeout...");
    const feed = await TimeoutHandler.execute(
      () => videoApi.getVideoFeed(3),
      10000 // 10 second timeout
    );
    console.log(`✓ Retrieved ${feed.length} videos within timeout`);

    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`\nUsing video ID: ${videoId}`);

      // 2. Operation with reasonable timeout
      console.log("\n2. Operation with reasonable timeout...");
      const video = await TimeoutHandler.execute(
        () => videoApi.getVideo(videoId),
        5000 // 5 second timeout
      );
      console.log(`✓ Retrieved video within timeout: ${video.title}`);

      // 3. Operation with very short timeout (should fail)
      console.log("\n3. Operation with very short timeout (should fail)...");
      try {
        const result = await TimeoutHandler.execute(
          () => videoApi.getVideo(videoId),
          1 // 1ms timeout (unrealistically short)
        );
        console.log("❌ This should have timed out");
      } catch (error) {
        console.log(`✓ Correctly timed out: ${error.message}`);
      }
    }

    // 4. Multiple operations with timeouts
    console.log("\n4. Multiple operations with timeouts...");

    const operations = [
      {
        name: "Get video feed",
        operation: () => videoApi.getVideoFeed(2),
        timeout: 5000,
      },
      {
        name: "Like video",
        operation: () => videoApi.likeVideo(feed[0].id),
        timeout: 3000,
      },
      {
        name: "Add comment",
        operation: () =>
          videoApi.commentOnVideo(feed[0].id, "Timeout demo comment"),
        timeout: 3000,
      },
    ];

    for (const { name, operation, timeout } of operations) {
      console.log(`\n  ${name} (timeout: ${timeout}ms)...`);
      try {
        const result = await TimeoutHandler.execute(operation, timeout);
        console.log(`  ✓ ${name} completed within timeout`);
      } catch (error) {
        console.log(`  ✗ ${name} timed out: ${error.message}`);
      }
    }

    console.log("\n🎉 Timeout demo completed successfully!");
  } catch (error) {
    console.error("❌ Timeout demo failed:", error.message);
  }
}

timeoutDemo();
