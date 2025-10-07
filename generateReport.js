// generateReport.js
// This script generates a system report

const fs = require("fs");
const { exec } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

class ReportGenerator {
  constructor() {
    this.report = {
      timestamp: new Date().toISOString(),
      system: {},
      application: {},
      database: {},
      performance: {},
    };
  }

  async getSystemInfo() {
    try {
      // Get OS information
      const { stdout: osInfo } = await execAsync("uname -a");
      this.report.system.os = osInfo.trim();
    } catch (error) {
      this.report.system.os = "Unknown";
    }

    try {
      // Get node version
      const { stdout: nodeVersion } = await execAsync("node --version");
      this.report.system.nodeVersion = nodeVersion.trim();
    } catch (error) {
      this.report.system.nodeVersion = "Unknown";
    }

    try {
      // Get npm version
      const { stdout: npmVersion } = await execAsync("npm --version");
      this.report.system.npmVersion = npmVersion.trim();
    } catch (error) {
      this.report.system.npmVersion = "Unknown";
    }
  }

  async getApplicationInfo() {
    try {
      // Get package info
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      this.report.application.name = packageJson.name;
      this.report.application.version = packageJson.version;
      this.report.application.dependencies = Object.keys(
        packageJson.dependencies || {}
      ).length;
      this.report.application.devDependencies = Object.keys(
        packageJson.devDependencies || {}
      ).length;
    } catch (error) {
      this.report.application.name = "Unknown";
    }
  }

  async getDatabaseInfo() {
    // In a real implementation, you would connect to the database
    // and get actual information
    this.report.database.status = "Simulated";
    this.report.database.tables = ["videos", "video_likes", "video_comments"];
    this.report.database.functions = [
      "increment_video_views",
      "increment_video_likes",
      "decrement_video_likes",
      "increment_video_comments",
    ];
  }

  async getPerformanceInfo() {
    // Simulate performance metrics
    this.report.performance.uptime = process.uptime();
    this.report.performance.memoryUsage = process.memoryUsage();
    this.report.performance.cpuUsage = process.cpuUsage();
  }

  async generate() {
    console.log("IG-Live System Report Generator");
    console.log("=============================");

    console.log("Gathering system information...");
    await this.getSystemInfo();

    console.log("Gathering application information...");
    await this.getApplicationInfo();

    console.log("Gathering database information...");
    await this.getDatabaseInfo();

    console.log("Gathering performance information...");
    await this.getPerformanceInfo();

    // Generate report file
    const reportFileName = `reports/iglive_report_${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.json`;

    // Create reports directory if it doesn't exist
    if (!fs.existsSync("reports")) {
      fs.mkdirSync("reports");
    }

    // Write report to file
    fs.writeFileSync(reportFileName, JSON.stringify(this.report, null, 2));

    console.log(`\n✅ Report generated successfully!`);
    console.log(`Report saved to: ${reportFileName}`);

    // Show summary
    console.log("\nReport Summary:");
    console.log(`  System: ${this.report.system.os}`);
    console.log(`  Node Version: ${this.report.system.nodeVersion}`);
    console.log(
      `  Application: ${this.report.application.name} v${this.report.application.version}`
    );
    console.log(
      `  Dependencies: ${this.report.application.dependencies} (prod) + ${this.report.application.devDependencies} (dev)`
    );
    console.log(`  Database Status: ${this.report.database.status}`);
    console.log(
      `  Uptime: ${Math.floor(this.report.performance.uptime / 60)} minutes`
    );

    return this.report;
  }
}

// Generate report if this script is executed directly
if (require.main === module) {
  const generator = new ReportGenerator();
  generator.generate().catch(console.error);
}

module.exports = { ReportGenerator };
