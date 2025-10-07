// cleanupOldVideos.js
const supabase = require("./src/config/supabase");

async function cleanupOldVideos() {
  try {
    console.log("Starting cleanup of old videos...");

    // Delete videos older than 2 weeks
    const { data, error } = await supabase
      .from("videos")
      .delete()
      .lt(
        "created_at",
        new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      );

    if (error) throw error;

    console.log(`Successfully deleted ${data.length} old videos`);
  } catch (error) {
    console.error("Error during video cleanup:", error);
  }
}

// Run the cleanup function
cleanupOldVideos();
