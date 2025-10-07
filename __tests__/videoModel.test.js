// videoModel.test.js
const videoModel = require("../src/models/videoModel");

// Mock Supabase client
const mockSupabase = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  rpc: jest.fn().mockReturnThis(),
};

describe("Video Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should get video feed", async () => {
    const mockData = [
      {
        id: "1",
        title: "Test Video",
        video_url: "https://example.com/video.mp4",
        user_profiles: {
          username: "testuser",
          avatar: "https://example.com/avatar.jpg",
        },
      },
    ];

    mockSupabase.select.mockResolvedValueOnce({ data: mockData, error: null });

    const videos = await videoModel.getVideoFeed(mockSupabase, 10);

    expect(videos).toHaveLength(1);
    expect(videos[0].title).toBe("Test Video");
    expect(mockSupabase.from).toHaveBeenCalledWith("videos");
  });

  test("should handle database errors", async () => {
    mockSupabase.select.mockResolvedValueOnce({
      data: null,
      error: new Error("Database error"),
    });

    await expect(videoModel.getVideoFeed(mockSupabase, 10)).rejects.toThrow(
      "Database error"
    );
  });
});
