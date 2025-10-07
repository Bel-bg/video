const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");
const interactionController = require("../controllers/interactionController");
const authMiddleware = require("../middleware/auth");

// Video routes
router.get("/feed", videoController.getVideoFeed);
router.get("/:id", videoController.getVideoById);
router.post("/", authMiddleware, videoController.uploadVideo);
router.delete("/:id", authMiddleware, videoController.deleteVideo);

// Interaction routes
router.post("/:id/like", authMiddleware, interactionController.toggleVideoLike);
router.get("/:id/comments", interactionController.getVideoComments);
router.post(
  "/:id/comment",
  authMiddleware,
  interactionController.addVideoComment
);

module.exports = router;
