// Interaction model functions for likes, comments, etc.

/**
 * Get video likes with user information
 * @param {Object} supabase - Supabase client instance
 * @param {string} videoId - ID of the video
 * @returns {Promise<Array>} - Array of like objects
 */
const getVideoLikes = async (supabase, videoId) => {
  try {
    const { data, error } = await supabase
      .from("video_likes")
      .select(
        `
        id,
        user_id,
        created_at,
        user_profiles (
          username,
          avatar
        )
      `
      )
      .eq("video_id", videoId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((like) => ({
      id: like.id,
      user_id: like.user_id,
      created_at: like.created_at,
      user: {
        username: like.user_profiles?.username || "Unknown",
        avatar: like.user_profiles?.avatar || null,
      },
    }));
  } catch (error) {
    console.error("Error in getVideoLikes:", error);
    throw error;
  }
};

/**
 * Check if user has liked a video
 * @param {Object} supabase - Supabase client instance
 * @param {string} videoId - ID of the video
 * @param {string} userId - ID of the user
 * @returns {Promise<boolean>} - Whether user has liked the video
 */
const hasUserLikedVideo = async (supabase, videoId, userId) => {
  try {
    const { data, error } = await supabase
      .from("video_likes")
      .select("id")
      .eq("video_id", videoId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error in hasUserLikedVideo:", error);
    throw error;
  }
};

/**
 * Toggle like for a video
 * @param {Object} supabase - Supabase client instance
 * @param {string} videoId - ID of the video
 * @param {string} userId - ID of the user
 * @returns {Promise<Object>} - Result of the like operation
 */
const toggleVideoLike = async (supabase, videoId, userId) => {
  try {
    // Check if user has already liked the video
    const hasLiked = await hasUserLikedVideo(supabase, videoId, userId);

    if (hasLiked) {
      // Unlike the video
      const { error: deleteError } = await supabase
        .from("video_likes")
        .delete()
        .eq("video_id", videoId)
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      // Decrement likes count
      const { error: decrementError } = await supabase.rpc(
        "decrement_video_likes",
        {
          video_id: videoId,
        }
      );

      if (decrementError) throw decrementError;

      return { liked: false };
    } else {
      // Like the video
      const { data: likeData, error: insertError } = await supabase
        .from("video_likes")
        .insert([{ video_id: videoId, user_id: userId }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Increment likes count
      const { error: incrementError } = await supabase.rpc(
        "increment_video_likes",
        {
          video_id: videoId,
        }
      );

      if (incrementError) throw incrementError;

      return { liked: true, like: likeData };
    }
  } catch (error) {
    console.error("Error in toggleVideoLike:", error);
    throw error;
  }
};

/**
 * Get comments for a video
 * @param {Object} supabase - Supabase client instance
 * @param {string} videoId - ID of the video
 * @param {number} page - Page number
 * @param {number} limit - Number of comments per page
 * @returns {Promise<Object>} - Comments data with pagination
 */
const getVideoComments = async (supabase, videoId, page = 1, limit = 10) => {
  try {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("video_comments")
      .select(
        `
        id,
        text,
        created_at,
        user_id,
        user_profiles (
          username,
          avatar
        )
      `,
        { count: "exact" }
      )
      .eq("video_id", videoId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    const comments = data.map((comment) => ({
      id: comment.id,
      text: comment.text,
      created_at: comment.created_at,
      user_id: comment.user_id,
      user: {
        username: comment.user_profiles?.username || "Unknown",
        avatar: comment.user_profiles?.avatar || null,
      },
    }));

    return {
      comments,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    console.error("Error in getVideoComments:", error);
    throw error;
  }
};

/**
 * Add a comment to a video
 * @param {Object} supabase - Supabase client instance
 * @param {string} videoId - ID of the video
 * @param {string} userId - ID of the user
 * @param {string} text - Comment text
 * @returns {Promise<Object>} - Comment data
 */
const addVideoComment = async (supabase, videoId, userId, text) => {
  try {
    // Insert the comment
    const { data: commentData, error: insertError } = await supabase
      .from("video_comments")
      .insert([{ video_id: videoId, user_id: userId, text }])
      .select(
        `
        id,
        text,
        created_at,
        user_id,
        user_profiles (
          username,
          avatar
        )
      `
      )
      .single();

    if (insertError) throw insertError;

    // Increment comments count
    const { error: incrementError } = await supabase.rpc(
      "increment_video_comments",
      {
        video_id: videoId,
      }
    );

    if (incrementError) throw incrementError;

    return {
      id: commentData.id,
      text: commentData.text,
      created_at: commentData.created_at,
      user_id: commentData.user_id,
      user: {
        username: commentData.user_profiles?.username || "Unknown",
        avatar: commentData.user_profiles?.avatar || null,
      },
    };
  } catch (error) {
    console.error("Error in addVideoComment:", error);
    throw error;
  }
};

module.exports = {
  getVideoLikes,
  hasUserLikedVideo,
  toggleVideoLike,
  getVideoComments,
  addVideoComment,
};
