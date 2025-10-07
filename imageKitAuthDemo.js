// imageKitAuthDemo.js
// This script demonstrates how to get ImageKit authentication parameters

const videoApi = require("./src/api/videoApi");

async function imageKitAuthDemo() {
  try {
    console.log("IG-Live ImageKit Auth Demo");
    console.log("=========================");

    console.log("\nGetting ImageKit authentication parameters...");
    const authParams = await videoApi.getImageKitAuth();
    console.log("Auth parameters:", authParams);

    console.log("\nImageKit auth demo completed successfully!");
  } catch (error) {
    console.error("ImageKit auth demo failed:", error.message);
  }
}

imageKitAuthDemo();
