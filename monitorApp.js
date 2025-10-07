// monitorApp.js
// This script monitors the application

const fs = require("fs");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

class AppMonitor {
  constructor() {
    this.monitoring = false;
    this.interval = null;
  }

  async checkHealth() {
    try {
      const response = await fetch("http://localhost:3000/api/health");
      const data = await response.json();

      return {
        status: response.status,
        healthy: data.status === "OK",
        message: data.message,
        timestamp: data.timestamp,
      };
    } catch (error) {
      return {
        status: 0,
        healthy: false,
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async checkDiskSpace() {
    // Simple disk space check (Linux/macOS)
    try {
      const { stdout } = await execAsync("df -h . | awk 'NR==2 {print $5}'");
      const usage = stdout.trim().replace("%", "");
      return {
        usage: parseInt(usage),
        status: usage > 90 ? "critical" : usage > 80 ? "warning" : "ok",
      };
    } catch (error) {
      return {
        usage: 0,
        status: "unknown",
      };
    }
  }

  async checkMemory() {
    // Simple memory check (Linux/macOS)
    try {
      const { stdout } = await execAsync(
        "free | grep Mem | awk '{print $3/$2 * 100.0}'"
      );
      const usage = parseFloat(stdout.trim());
      return {
        usage: usage,
        status: usage > 90 ? "critical" : usage > 80 ? "warning" : "ok",
      };
    } catch (error) {
      return {
        usage: 0,
        status: "unknown",
      };
    }
  }

  async startMonitoring(intervalMs = 30000) {
    console.log("IG-Live Application Monitor");
    console.log("=========================");
    console.log(`Starting monitoring every ${intervalMs / 1000} seconds...`);
    console.log("Press Ctrl+C to stop monitoring\n");

    this.monitoring = true;

    // Initial check
    await this.performCheck();

    // Set up interval
    this.interval = setInterval(() => {
      this.performCheck();
    }, intervalMs);
  }

  async performCheck() {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Performing health check...`);

    // Check application health
    const health = await this.checkHealth();
    console.log(
      `  Health: ${health.healthy ? "✅ HEALTHY" : "❌ UNHEALTHY"} (${
        health.status
      })`
    );
    console.log(`  Message: ${health.message}`);

    // Check disk space
    const disk = await this.checkDiskSpace();
    console.log(
      `  Disk: ${disk.usage}% ${
        disk.status === "critical"
          ? "🔴"
          : disk.status === "warning"
          ? "🟡"
          : "🟢"
      }`
    );

    // Check memory
    const memory = await this.checkMemory();
    console.log(
      `  Memory: ${memory.usage.toFixed(1)}% ${
        memory.status === "critical"
          ? "🔴"
          : memory.status === "warning"
          ? "🟡"
          : "🟢"
      }`
    );

    console.log("");
  }

  stopMonitoring() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.monitoring = false;
    console.log("Monitoring stopped.");
  }
}

// Create monitor instance
const monitor = new AppMonitor();

// Handle Ctrl+C
process.on("SIGINT", () => {
  console.log("\nReceived SIGINT. Stopping monitor...");
  monitor.stopMonitoring();
  process.exit(0);
});

// Run monitor if this script is executed directly
if (require.main === module) {
  const interval = process.argv[2] ? parseInt(process.argv[2]) : 30000;
  monitor.startMonitoring(interval);
}

module.exports = { AppMonitor };
