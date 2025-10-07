// runCleanup.js
// This script runs the cleanup job

const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

async function runCleanup() {
  console.log("IG-Live Video Cleanup Job");
  console.log("========================");

  try {
    // Run the cleanup script
    console.log("Running cleanup of videos older than 2 weeks...");
    const { stdout, stderr } = await execAsync(
      "node src/utils/cleanupOldVideos.js",
      {
        timeout: 60000, // 1 minute timeout
      }
    );

    if (stdout) {
      console.log(stdout);
    }

    if (stderr) {
      console.error("STDERR:", stderr);
    }

    console.log("✅ Cleanup job completed successfully!");
  } catch (error) {
    console.error("❌ Cleanup job failed:", error.message);
  }
}

// Run cleanup if this script is executed directly
if (require.main === module) {
  runCleanup();
}

module.exports = { runCleanup };
