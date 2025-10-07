// monitoringDemo.js
// This script demonstrates API monitoring and metrics

const videoApi = require("./src/api/videoApi");

// Simple metrics collector
class MetricsCollector {
  constructor() {
    this.metrics = {
      apiCalls: 0,
      apiErrors: 0,
      totalResponseTime: 0,
      apiCallHistory: [],
    };
  }

  recordCall(operation, duration, success) {
    this.metrics.apiCalls++;
    if (!success) {
      this.metrics.apiErrors++;
    }
    this.metrics.totalResponseTime += duration;

    // Record call history (keep last 100 calls)
    this.metrics.apiCallHistory.push({
      operation,
      duration,
      success,
      timestamp: new Date().toISOString(),
    });

    if (this.metrics.apiCallHistory.length > 100) {
      this.metrics.apiCallHistory.shift();
    }
  }

  getStats() {
    const totalCalls = this.metrics.apiCalls;
    const errorRate =
      totalCalls > 0
        ? ((this.metrics.apiErrors / totalCalls) * 100).toFixed(2)
        : 0;
    const avgResponseTime =
      totalCalls > 0
        ? (this.metrics.totalResponseTime / totalCalls).toFixed(2)
        : 0;

    return {
      totalCalls,
      errors: this.metrics.apiErrors,
      errorRate: `${errorRate}%`,
      averageResponseTime: `${avgResponseTime}ms`,
      recentCalls: this.metrics.apiCallHistory.slice(-5), // Last 5 calls
    };
  }

  reset() {
    this.metrics = {
      apiCalls: 0,
      apiErrors: 0,
      totalResponseTime: 0,
      apiCallHistory: [],
    };
  }
}

// API wrapper with monitoring
class MonitoredApi {
  constructor() {
    this.collector = new MetricsCollector();
  }

  async call(operationName, apiCall, ...args) {
    const start = Date.now();
    let success = false;

    try {
      console.log(`Calling ${operationName}...`);
      const result = await apiCall(...args);
      success = true;
      return result;
    } finally {
      const end = Date.now();
      const duration = end - start;
      this.collector.recordCall(operationName, duration, success);
      console.log(
        `  ${operationName} completed in ${duration}ms (${
          success ? "SUCCESS" : "FAILED"
        })`
      );
    }
  }

  getMetrics() {
    return this.collector.getStats();
  }

  resetMetrics() {
    this.collector.reset();
  }
}

async function monitoringDemo() {
  try {
    console.log("IG-Live Monitoring Demo");
    console.log("=====================");

    const monitoredApi = new MonitoredApi();

    // 1. Perform various API operations
    console.log("\n1. Performing API operations with monitoring...");

    // Get video feed
    const feed = await monitoredApi.call(
      "getVideoFeed",
      videoApi.getVideoFeed,
      3
    );
    console.log(`  Retrieved ${feed.length} videos`);

    if (feed.length > 0) {
      const videoId = feed[0].id;
      console.log(`  Using video ID: ${videoId}`);

      // Get video details
      await monitoredApi.call("getVideo", videoApi.getVideo, videoId);

      // Like video
      await monitoredApi.call("likeVideo", videoApi.likeVideo, videoId);

      // Add comment
      await monitoredApi.call(
        "commentOnVideo",
        videoApi.commentOnVideo,
        videoId,
        "Monitoring demo comment"
      );

      // Get comments
      await monitoredApi.call(
        "getVideoComments",
        videoApi.getVideoComments,
        videoId,
        1,
        5
      );

      // Share video
      await monitoredApi.call(
        "shareVideo",
        videoApi.shareVideo,
        videoId,
        "monitoring_demo"
      );
    }

    // 2. Show metrics
    console.log("\n2. Monitoring metrics:");
    const metrics = monitoredApi.getMetrics();
    console.log(`  Total API calls: ${metrics.totalCalls}`);
    console.log(`  API errors: ${metrics.errors}`);
    console.log(`  Error rate: ${metrics.errorRate}`);
    console.log(`  Average response time: ${metrics.averageResponseTime}`);

    console.log("\n  Recent calls:");
    metrics.recentCalls.forEach((call) => {
      console.log(
        `    ${call.operation}: ${call.duration}ms (${
          call.success ? "SUCCESS" : "FAILED"
        }) at ${call.timestamp}`
      );
    });

    // 3. Simulate an error
    console.log("\n3. Simulating an error...");
    try {
      await monitoredApi.call("getError", videoApi.getVideo, "invalid-id");
    } catch (error) {
      console.log("  Error simulated and recorded");
    }

    // 4. Show updated metrics
    console.log("\n4. Updated metrics after error:");
    const updatedMetrics = monitoredApi.getMetrics();
    console.log(`  Total API calls: ${updatedMetrics.totalCalls}`);
    console.log(`  API errors: ${updatedMetrics.errors}`);
    console.log(`  Error rate: ${updatedMetrics.errorRate}`);

    console.log("\n🎉 Monitoring demo completed successfully!");
  } catch (error) {
    console.error("❌ Monitoring demo failed:", error.message);
  }
}

monitoringDemo();
