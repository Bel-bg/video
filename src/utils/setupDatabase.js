const supabase = require("./config/supabase");

async function setupDatabase() {
  try {
    console.log("Setting up database...");

    // Create videos table
    const { error: videosError } = await supabase.rpc("create_videos_table");
    if (videosError) throw videosError;

    // Create video_likes table
    const { error: likesError } = await supabase.rpc(
      "create_video_likes_table"
    );
    if (likesError) throw likesError;

    // Create video_comments table
    const { error: commentsError } = await supabase.rpc(
      "create_video_comments_table"
    );
    if (commentsError) throw commentsError;

    // Create functions
    const { error: functionsError } = await supabase.rpc(
      "create_counter_functions"
    );
    if (functionsError) throw functionsError;

    console.log("Database setup completed successfully!");
  } catch (error) {
    console.error("Error setting up database:", error);
  }
}

setupDatabase();
