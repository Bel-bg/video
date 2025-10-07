// videoApi.test.js
const videoApi = require("./src/api/videoApi");

describe("Video API", () => {
  // Mock fetch globally
  global.fetch = jest.fn();

  beforeEach(() => {
    fetch.mockClear();
  });

  test("should get video feed", async () => {
    // Mock response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [
          {
            id: "1",
            title: "Test Video",
            video_url: "https://example.com/video.mp4",
          },
        ],
      }),
    });

    const videos = await videoApi.getVideoFeed(5);

    expect(videos).toHaveLength(1);
    expect(videos[0].title).toBe("Test Video");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/videos/feed?limit=5"),
      expect.any(Object)
    );
  });

  test("should handle API errors", async () => {
    // Mock error response
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: "Internal server error" }),
    });

    await expect(videoApi.getVideoFeed(5)).rejects.toThrow(
      "Internal server error"
    );
  });
});
