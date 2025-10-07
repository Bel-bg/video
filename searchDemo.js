// searchDemo.js
// This script demonstrates API with search functionality

const videoApi = require("./src/api/videoApi");

// Search utilities
class SearchEngine {
  static normalizeText(text) {
    if (!text) return "";
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9\s]/g, ""); // Remove special characters
  }

  static tokenize(text) {
    return this.normalizeText(text)
      .split(/\s+/)
      .filter((token) => token.length > 0);
  }

  static calculateRelevance(text, query) {
    const normalizedText = this.normalizeText(text);
    const normalizedQuery = this.normalizeText(query);

    // Exact match
    if (normalizedText.includes(normalizedQuery)) {
      return 1.0;
    }

    // Token matching
    const textTokens = this.tokenize(text);
    const queryTokens = this.tokenize(query);

    if (queryTokens.length === 0) return 0;

    const matches = queryTokens.filter((token) =>
      textTokens.some((textToken) => textToken.includes(token))
    );

    return matches.length / queryTokens.length;
  }
}

// Search-aware API wrapper
class SearchApi {
  constructor() {
    this.searchCache = new Map();
  }

  async searchVideos(query, options = {}) {
    console.log(`🔍 Searching videos for: "${query}"`);

    const {
      limit = 10,
      sortBy = "relevance", // 'relevance', 'newest', 'popular'
      includeDescription = true,
    } = options;

    // Check cache first
    const cacheKey = `search_${query}_${limit}_${sortBy}_${includeDescription}`;
    const cached = this.searchCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      // 5 minutes cache
      console.log("  Using cached search results");
      return cached.results;
    }

    // Get full video feed (in a real app, you'd have a search endpoint)
    console.log("  Fetching video feed for search");
    const allVideos = await videoApi.getVideoFeed(100); // Get more videos for better search

    // Perform search
    const results = allVideos
      .map((video) => {
        // Calculate relevance score
        let relevance = SearchEngine.calculateRelevance(video.title, query);

        if (includeDescription && video.description) {
          // Include description in relevance calculation
          const descRelevance = SearchEngine.calculateRelevance(
            video.description,
            query
          );
          relevance = Math.max(relevance, descRelevance);
        }

        return {
          ...video,
          relevance,
        };
      })
      .filter((video) => video.relevance > 0) // Only videos with some relevance
      .sort((a, b) => {
        // Sort by specified criteria
        switch (sortBy) {
          case "newest":
            return new Date(b.created_at) - new Date(a.created_at);
          case "popular":
            return (b.likes_count || 0) - (a.likes_count || 0);
          case "relevance":
          default:
            return b.relevance - a.relevance;
        }
      })
      .slice(0, limit);

    // Cache results
    this.searchCache.set(cacheKey, {
      results,
      timestamp: Date.now(),
    });

    console.log(`  Found ${results.length} videos matching "${query}"`);
    return results;
  }

  async searchVideosByTag(tag, limit = 10) {
    console.log(`🏷️ Searching videos by tag: "${tag}"`);

    // In a real implementation, you would have tags in your video data
    // For this demo, we'll simulate tag search
    const allVideos = await videoApi.getVideoFeed(100);

    // Simulate tag matching (in real app, videos would have tags array)
    const results = allVideos
      .filter((video) => {
        // Simulate tag matching
        const titleTags = SearchEngine.tokenize(video.title);
        const descTags = video.description
          ? SearchEngine.tokenize(video.description)
          : [];
        const allTags = [...titleTags, ...descTags];

        return allTags.some((videoTag) =>
          videoTag.includes(SearchEngine.normalizeText(tag))
        );
      })
      .slice(0, limit);

    console.log(`  Found ${results.length} videos with tag "${tag}"`);
    return results;
  }

  async searchVideosByUser(username, limit = 10) {
    console.log(`👤 Searching videos by user: "${username}"`);

    const allVideos = await videoApi.getVideoFeed(100);

    const results = allVideos
      .filter(
        (video) =>
          video.users &&
          video.users.username &&
          SearchEngine.normalizeText(video.users.username).includes(
            SearchEngine.normalizeText(username)
          )
      )
      .slice(0, limit);

    console.log(`  Found ${results.length} videos by user "${username}"`);
    return results;
  }

  clearSearchCache() {
    this.searchCache.clear();
    console.log("🧹 Cleared search cache");
  }

  getSearchCacheSize() {
    return this.searchCache.size;
  }
}

async function searchDemo() {
  try {
    console.log("IG-Live Search Demo");
    console.log("=================");

    const searchApi = new SearchApi();

    // 1. Upload some test videos with different content
    console.log("\n1. Uploading test videos for search...");

    const testVideos = [
      {
        title: "Cooking Tutorial: How to Make Pasta",
        description:
          "Learn how to make delicious pasta from scratch with this easy tutorial",
        video_url: "https://example.com/cooking-pasta.mp4",
      },
      {
        title: "Travel Vlog: Paris Adventure",
        description:
          "Join me on an amazing adventure through the streets of Paris, France",
        video_url: "https://example.com/paris-travel.mp4",
      },
      {
        title: "Tech Review: Latest Smartphone",
        description:
          "In-depth review of the newest smartphone hitting the market this year",
        video_url: "https://example.com/tech-review.mp4",
      },
      {
        title: "Fitness Workout: Morning Routine",
        description:
          "Start your day with this energizing morning workout routine for fitness",
        video_url: "https://example.com/fitness-workout.mp4",
      },
      {
        title: "Music Performance: Jazz Band Live",
        description:
          "Live performance by our local jazz band at the downtown music venue",
        video_url: "https://example.com/jazz-performance.mp4",
      },
    ];

    // Note: In a real demo, we would upload these videos
    // For this demo, we'll just simulate having them in the feed

    // 2. Search by keyword
    console.log('\n2. Searching by keyword "pasta"...');
    const pastaResults = await searchApi.searchVideos("pasta");
    console.log(`  Found ${pastaResults.length} results:`);
    pastaResults.forEach((video, index) => {
      console.log(
        `    ${index + 1}. ${video.title} (relevance: ${(
          video.relevance * 100
        ).toFixed(1)}%)`
      );
    });

    // 3. Search by keyword with different sorting
    console.log('\n3. Searching by keyword "tech" sorted by popularity...');
    const techResults = await searchApi.searchVideos("tech", {
      sortBy: "popular",
      limit: 5,
    });
    console.log(`  Found ${techResults.length} results:`);
    techResults.forEach((video, index) => {
      console.log(
        `    ${index + 1}. ${video.title} (${video.likes_count || 0} likes)`
      );
    });

    // 4. Search by tag
    console.log('\n4. Searching by tag "travel"...');
    const travelResults = await searchApi.searchVideosByTag("travel");
    console.log(`  Found ${travelResults.length} results:`);
    travelResults.forEach((video, index) => {
      console.log(`    ${index + 1}. ${video.title}`);
    });

    // 5. Search by user
    console.log('\n5. Searching by user "john"...');
    const userResults = await searchApi.searchVideosByUser("john");
    console.log(`  Found ${userResults.length} results:`);
    userResults.forEach((video, index) => {
      console.log(
        `    ${index + 1}. ${video.title} by @${video.users.username}`
      );
    });

    // 6. Complex search
    console.log('\n6. Complex search for "morning fitness workout"...');
    const complexResults = await searchApi.searchVideos(
      "morning fitness workout",
      {
        limit: 3,
        sortBy: "relevance",
        includeDescription: true,
      }
    );
    console.log(`  Found ${complexResults.length} results:`);
    complexResults.forEach((video, index) => {
      console.log(
        `    ${index + 1}. ${video.title} (relevance: ${(
          video.relevance * 100
        ).toFixed(1)}%)`
      );
    });

    // 7. Show search cache
    console.log("\n7. Search cache status:");
    console.log(`  Cache size: ${searchApi.getSearchCacheSize()} entries`);

    // 8. Search with cache hit
    console.log("\n8. Searching again (should use cache)...");
    const cachedResults = await searchApi.searchVideos("pasta");
    console.log(`  Found ${cachedResults.length} results from cache`);

    // 9. Clear cache
    console.log("\n9. Clearing search cache...");
    searchApi.clearSearchCache();
    console.log(
      `  Cache size after clear: ${searchApi.getSearchCacheSize()} entries`
    );

    console.log("\n🎉 Search demo completed successfully!");
  } catch (error) {
    console.error("❌ Search demo failed:", error.message);
  }
}

searchDemo();
