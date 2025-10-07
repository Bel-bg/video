const imagekit = require("../config/imagekit");

/**
 * Get ImageKit authentication parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getImageKitAuth = async (req, res) => {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    res.status(200).json({
      success: true,
      data: authenticationParameters,
      message: "Authentication parameters retrieved successfully",
    });
  } catch (error) {
    console.error("Error in getImageKitAuth controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve authentication parameters",
      error: error.message,
    });
  }
};

module.exports = {
  getImageKitAuth,
};
