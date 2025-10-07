const interactionModel = require("../models/interactionModel");
const supabase = require("../config/supabase");

/**
 * Toggle like for a video
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const toggleVideoLike = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { userId } = req;

    // Check if video exists
    const { data: video, error: videoError } = await supabase
      .from("videos")
      .select("id")
      .eq("id", videoId)
      .maybeSingle();

    if (videoError) throw videoError;
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const result = await interactionModel.toggleVideoLike(
      supabase,
      videoId,
      userId
    );

    res.status(200).json({
      success: true,
      data: result,
      message: result.liked
        ? "Video liked successfully"
        : "Video unliked successfully",
    });
  } catch (error) {
    console.error("Error in toggleVideoLike controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle video like",
      error: error.message,
    });
  }
};

/**
 * Get comments for a video
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getVideoComments = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Check if video exists
    const { data: video, error: videoError } = await supabase
      .from("videos")
      .select("id")
      .eq("id", videoId)
      .maybeSingle();

    if (videoError) throw videoError;
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const commentsData = await interactionModel.getVideoComments(
      supabase,
      videoId,
      parseInt(page),
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      data: commentsData,
      message: "Comments retrieved successfully",
    });
  } catch (error) {
    console.error("Error in getVideoComments controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve comments",
      error: error.message,
    });
  }
};

/**
 * Add a comment to a video
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addVideoComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { userId } = req;
    const { text } = req.body;

    // Validate required fields
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    // Check if video exists
    const { data: video, error: videoError } = await supabase
      .from("videos")
      .select("id")
      .eq("id", videoId)
      .maybeSingle();

    if (videoError) throw videoError;
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const comment = await interactionModel.addVideoComment(
      supabase,
      videoId,
      userId,
      text.trim()
    );

    res.status(201).json({
      success: true,
      data: comment,
      message: "Comment added successfully",
    });
  } catch (error) {
    console.error("Error in addVideoComment controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

module.exports = {
  toggleVideoLike,
  getVideoComments,
  addVideoComment,
};
