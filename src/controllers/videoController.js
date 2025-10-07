const videoModel = require("../models/videoModel");
const interactionModel = require("../models/interactionModel");
const supabase = require("../config/supabase");

/**
 * Get video feed
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getVideoFeed = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const videos = await videoModel.getVideoFeed(supabase, parseInt(limit));
    res.status(200).json({
      success: true,
      data: videos,
      message: "Video feed retrieved successfully",
    });
  } catch (error) {
    console.error("Error in getVideoFeed controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve video feed",
      error: error.message,
    });
  }
};

/**
 * Get a specific video by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await videoModel.getVideoById(supabase, id);

    // Increment view count
    await videoModel.incrementVideoViews(supabase, id);

    res.status(200).json({
      success: true,
      data: video,
      message: "Video retrieved successfully",
    });
  } catch (error) {
    console.error("Error in getVideoById controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve video",
      error: error.message,
    });
  }
};

/**
 * Upload a new video
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const uploadVideo = async (req, res) => {
  try {
    const { userId } = req;
    const { title, description, video_url, thumbnail_url } = req.body;

    // Validate required fields
    if (!video_url) {
      return res.status(400).json({
        success: false,
        message: "Video URL is required",
      });
    }

    const videoData = {
      title: title || null,
      description: description || null,
      video_url,
      thumbnail_url: thumbnail_url || null,
      user_id: userId,
      views_count: 0,
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
    };

    const video = await videoModel.createVideo(supabase, videoData);

    res.status(201).json({
      success: true,
      data: video,
      message: "Video uploaded successfully",
    });
  } catch (error) {
    console.error("Error in uploadVideo controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload video",
      error: error.message,
    });
  }
};

/**
 * Delete a video
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    // Check if user owns the video
    const { data: video, error: fetchError } = await supabase
      .from("videos")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    if (video.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this video",
      });
    }

    await videoModel.deleteVideo(supabase, id);

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteVideo controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete video",
      error: error.message,
    });
  }
};

module.exports = {
  getVideoFeed,
  getVideoById,
  uploadVideo,
  deleteVideo,
};
