// Video model functions for interacting with Supabase

/**
 * Get video feed with user information
 * @param {number} limit - Number of videos to fetch
 * @returns {Promise<Array>} - Array of video objects
 */
const getVideoFeed = async (supabase, limit = 10) => {
  try {
    // Get videos with user information, ordered by created_at descending
    const { data, error } = await supabase
      .from("videos")
      .select(
        `
        id,
        title,
        description,
        video_url,
        thumbnail_url,
        views_count,
        likes_count,
        comments_count,
        created_at,
        user_id,
        user_profiles (
          username,
          avatar
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Transform data to match frontend expectations
    return data.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url,
      views_count: video.views_count || 0,
      likes_count: video.likes_count || 0,
      comments_count: video.comments_count || 0,
      created_at: video.created_at,
      user_id: video.user_id,
      users: {
        username: video.user_profiles?.username || "Unknown",
        avatar: video.user_profiles?.avatar || null,
        verified: false, // Add verification logic if needed
      },
    }));
  } catch (error) {
    console.error("Error in getVideoFeed:", error);
    throw error;
  }
};

/**
 * Get a specific video by ID with user information
 * @param {Object} supabase - Supabase client instance
 * @param {string} videoId - ID of the video
 * @returns {Promise<Object>} - Video object
 */
const getVideoById = async (supabase, videoId) => {
  try {
    const { data, error } = await supabase
      .from("videos")
      .select(
        `
        id,
        title,
        description,
        video_url,
        thumbnail_url,
        views_count,
        likes_count,
        comments_count,
        created_at,
        user_id,
        user_profiles (
          username,
          avatar
        )
      `
      )
      .eq("id", videoId)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Video not found");

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      video_url: data.video_url,
      thumbnail_url: data.thumbnail_url,
      views_count: data.views_count || 0,
      likes_count: data.likes_count || 0,
      comments_count: data.comments_count || 0,
      created_at: data.created_at,
      user_id: data.user_id,
      users: {
        username: data.user_profiles?.username || "Unknown",
        avatar: data.user_profiles?.avatar || null,
        verified: false,
      },
    };
  } catch (error) {
    console.error("Error in getVideoById:", error);
    throw error;
  }
};

/**
 * Create a new video
 * @param {Object} supabase - Supabase client instance
 * @param {Object} videoData - Video data to insert
 * @returns {Promise<Object>} - Created video object
 */
const createVideo = async (supabase, videoData) => {
  try {
    const { data, error } = await supabase
      .from("videos")
      .insert([videoData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in createVideo:", error);
    throw error;
  }
};

/**
 * Delete a video
 * @param {Object} supabase - Supabase client instance
 * @param {string} videoId - ID of the video to delete
 * @returns {Promise<boolean>} - Whether deletion was successful
 */
const deleteVideo = async (supabase, videoId) => {
  try {
    const { error } = await supabase.from("videos").delete().eq("id", videoId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error in deleteVideo:", error);
    throw error;
  }
};

/**
 * Increment video views count
 * @param {Object} supabase - Supabase client instance
 * @param {string} videoId - ID of the video
 * @returns {Promise<Object>} - Updated video object
 */
const incrementVideoViews = async (supabase, videoId) => {
  try {
    const { data, error } = await supabase.rpc("increment_video_views", {
      video_id: videoId,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in incrementVideoViews:", error);
    throw error;
  }
};

module.exports = {
  getVideoFeed,
  getVideoById,
  createVideo,
  deleteVideo,
  incrementVideoViews,
};
