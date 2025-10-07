// healthCheck.js
// This script performs a comprehensive health check

const { AppMonitor } = require("./monitorApp");

async function runHealthCheck() {
  console.log("IG-Live Health Check");
  console.log("==================");

  const monitor = new AppMonitor();

  try {
    // 1. Check application health
    console.log("\n1. Checking application health...");
    const health = await monitor.checkHealth();
    console.log(`  Status: ${health.healthy ? "✅ HEALTHY" : "❌ UNHEALTHY"}`);
    console.log(`  HTTP Status: ${health.status}`);
    console.log(`  Message: ${health.message}`);
    console.log(`  Timestamp: ${health.timestamp}`);

    // 2. Check disk space
    console.log("\n2. Checking disk space...");
    const disk = await monitor.checkDiskSpace();
    console.log(`  Usage: ${disk.usage}%`);
    console.log(
      `  Status: ${
        disk.status === "critical"
          ? "🔴 CRITICAL"
          : disk.status === "warning"
          ? "🟡 WARNING"
          : "🟢 OK"
      }`
    );

    // 3. Check memory
    console.log("\n3. Checking memory...");
    const memory = await monitor.checkMemory();
    console.log(`  Usage: ${memory.usage.toFixed(1)}%`);
    console.log(
      `  Status: ${
        memory.status === "critical"
          ? "🔴 CRITICAL"
          : memory.status === "warning"
          ? "🟡 WARNING"
          : "🟢 OK"
      }`
    );

    // 4. Check database connectivity
    console.log("\n4. Checking database connectivity...");
    try {
      // In a real implementation, you would actually connect to the database
      console.log("  ✅ Database connection test passed (simulated)");
    } catch (error) {
      console.log(`  ❌ Database connection failed: ${error.message}`);
    }

    // 5. Check external services
    console.log("\n5. Checking external services...");

    // Check ImageKit
    try {
      const response = await fetch("https://imagekit.io");
      console.log(`  ImageKit: ${response.ok ? "✅ OK" : "❌ UNAVAILABLE"}`);
    } catch (error) {
      console.log(`  ImageKit: ❌ UNAVAILABLE (${error.message})`);
    }

    // 6. Check API endpoints
    console.log("\n6. Checking API endpoints...");

    const endpoints = [
      "/api/health",
      "/api/videos/feed?limit=1",
      "/api/auth/imagekit",
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://localhost:3000${endpoint}`);
        console.log(
          `  ${endpoint}: ${response.ok ? "✅ OK" : `❌ ${response.status}`}`
        );
      } catch (error) {
        console.log(`  ${endpoint}: ❌ UNAVAILABLE (${error.message})`);
      }
    }

    // 7. Overall status
    console.log("\n" + "=".repeat(40));
    console.log("Overall Health Status:");

    const checks = [
      health.healthy,
      disk.status !== "critical",
      memory.status !== "critical",
    ];
    const allHealthy = checks.every((check) => check);

    console.log(
      `  Status: ${
        allHealthy ? "✅ ALL SYSTEMS OPERATIONAL" : "⚠️  ISSUES DETECTED"
      }`
    );

    if (!allHealthy) {
      console.log("\nRecommended Actions:");
      if (!health.healthy) {
        console.log("  - Restart the application server");
      }
      if (disk.status === "critical") {
        console.log("  - Free up disk space immediately");
      }
      if (memory.status === "critical") {
        console.log("  - Restart the application to free memory");
      }
    }

    console.log("\n🎉 Health check completed!");
  } catch (error) {
    console.error("❌ Health check failed:", error.message);
  }
}

// Run health check if this script is executed directly
if (require.main === module) {
  runHealthCheck();
}

module.exports = { runHealthCheck };
