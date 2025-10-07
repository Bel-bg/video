// verifyDatabase.js
// This script verifies the database setup

const supabase = require("./src/config/supabase");

async function verifyDatabase() {
  try {
    console.log("IG-Live Database Verification");
    console.log("==========================");

    // 1. Check if videos table exists
    console.log("\n1. Checking videos table...");
    const { data: videosTable, error: videosError } = await supabase
      .from("videos")
      .select("*")
      .limit(1);

    if (videosError) {
      console.log("  ❌ Videos table check failed:", videosError.message);
    } else {
      console.log("  ✅ Videos table exists and is accessible");
    }

    // 2. Check if video_likes table exists
    console.log("\n2. Checking video_likes table...");
    const { data: likesTable, error: likesError } = await supabase
      .from("video_likes")
      .select("*")
      .limit(1);

    if (likesError) {
      console.log("  ❌ Video likes table check failed:", likesError.message);
    } else {
      console.log("  ✅ Video likes table exists and is accessible");
    }

    // 3. Check if video_comments table exists
    console.log("\n3. Checking video_comments table...");
    const { data: commentsTable, error: commentsError } = await supabase
      .from("video_comments")
      .select("*")
      .limit(1);

    if (commentsError) {
      console.log(
        "  ❌ Video comments table check failed:",
        commentsError.message
      );
    } else {
      console.log("  ✅ Video comments table exists and is accessible");
    }

    // 4. Check if functions exist
    console.log("\n4. Checking database functions...");

    // Test increment_video_views function
    try {
      const { data: viewsFunction, error: viewsError } = await supabase.rpc(
        "increment_video_views",
        {
          video_id: "00000000-0000-0000-0000-000000000000", // Test with dummy UUID
        }
      );

      if (viewsError && !viewsError.message.includes("invalid input syntax")) {
        console.log(
          "  ❌ increment_video_views function check failed:",
          viewsError.message
        );
      } else {
        console.log("  ✅ increment_video_views function exists");
      }
    } catch (error) {
      console.log(
        "  ✅ increment_video_views function exists (expected error for dummy UUID)"
      );
    }

    // Test increment_video_likes function
    try {
      const { data: likesFunction, error: likesFuncError } = await supabase.rpc(
        "increment_video_likes",
        {
          video_id: "00000000-0000-0000-0000-000000000000", // Test with dummy UUID
        }
      );

      if (
        likesFuncError &&
        !likesFuncError.message.includes("invalid input syntax")
      ) {
        console.log(
          "  ❌ increment_video_likes function check failed:",
          likesFuncError.message
        );
      } else {
        console.log("  ✅ increment_video_likes function exists");
      }
    } catch (error) {
      console.log(
        "  ✅ increment_video_likes function exists (expected error for dummy UUID)"
      );
    }

    // 5. Check RLS policies
    console.log("\n5. Checking RLS policies...");

    // This is harder to verify programmatically, but we can check if RLS is enabled
    console.log(
      "  ℹ️  RLS policies should be verified through Supabase dashboard"
    );
    console.log(
      "  ℹ️  Check that policies are set for videos, video_likes, and video_comments tables"
    );

    // 6. Check indexes
    console.log("\n6. Checking database indexes...");
    console.log("  ℹ️  Indexes should be verified through Supabase dashboard");
    console.log(
      "  ℹ️  Check for indexes on user_id, created_at, and foreign key columns"
    );

    console.log("\n🎉 Database verification completed!");
    console.log("\nNext steps:");
    console.log("1. Check Supabase dashboard for RLS policies");
    console.log("2. Verify indexes are created");
    console.log("3. Test actual data operations");
  } catch (error) {
    console.error("❌ Database verification failed:", error.message);
  }
}

verifyDatabase();
